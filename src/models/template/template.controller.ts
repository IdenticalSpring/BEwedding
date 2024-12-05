import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './entity/template.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Assuming Cloudinary service is imported
import { FileInterceptor } from '@nestjs/platform-express'; // File upload interceptor
import { Public } from 'src/auth/decorators/public.decorator';
import { AdminGuard } from 'src/guards/admin.guard';

@ApiTags('Templates') // Gắn tag để nhóm API trong Swagger
@Controller('templates')
@ApiBearerAuth('JWT')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly cloudinaryService: CloudinaryService, // Injecting Cloudinary service
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo một mẫu giao diện mới' })
  @ApiConsumes('multipart/form-data') // Specify content type for file upload
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        thumbnail: { type: 'string', format: 'binary' }, // For image upload
        accessType: { type: 'string' },
        metaData: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Tạo mẫu giao diện thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu gửi không hợp lệ' })
  @UseInterceptors(FileInterceptor('thumbnail')) // Interceptor for handling file uploads
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file); // Cloudinary upload
      createTemplateDto.thumbnailUrl = uploadedImage.secure_url; // Save the image URL
    }
    return this.templateService.create(createTemplateDto); // Call the service to create the template
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Lấy danh sách tất cả mẫu giao diện' })
  @ApiResponse({ status: 200, description: 'Danh sách mẫu giao diện' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    return this.templateService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết mẫu giao diện' })
  @ApiResponse({ status: 200, description: 'Thông tin mẫu giao diện' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mẫu giao diện' })
  async findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin mẫu giao diện' })
  @ApiConsumes('multipart/form-data') // Handle multipart/form-data for file upload
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        thumbnail: { type: 'string', format: 'binary' }, // For updating thumbnail
        accessType: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('thumbnail')) // Interceptor for file upload
  @ApiResponse({
    status: 200,
    description: 'Cập nhật mẫu giao diện thành công',
    type: Template,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mẫu giao diện' })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file); // Cloudinary upload
      updateTemplateDto.thumbnailUrl = uploadedImage.secure_url; // Save the image URL
    }
    return this.templateService.update(id, updateTemplateDto); // Call the service to update the template
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa một mẫu giao diện' })
  @ApiResponse({ status: 204, description: 'Xóa mẫu giao diện thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mẫu giao diện' })
  async remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }
}
