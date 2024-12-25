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
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TemplateUserService } from './template-user.service';
import { CreateTemplateUserDto } from './dto/create-template-user.dto';
import { templateUser } from './entity/template-user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateTemplateUserDto } from './dto/update-template-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Template_user')
@Controller('templates_user')
@ApiBearerAuth('JWT')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateUserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new template' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        thumbnailUrl: { type: 'string' },
        // accessType: { type: 'string' },
        metaData: { type: 'string' },
        userId: { type: 'number' },
        linkName: { type: 'string' },
  
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UseInterceptors(FileInterceptor('thumbnail')) // Handles file uploads
  async create(
    @Body() createTemplateDto: CreateTemplateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // Log dữ liệu đầu vào
      console.log("CreateTemplateUserDto:", createTemplateDto);

      if (file) {
        console.log("File detected, starting upload...");
        const uploadedImage = await this.cloudinaryService.uploadImage(file);
        console.log("Uploaded Image URL:", uploadedImage.secure_url);
        createTemplateDto.thumbnailUrl = uploadedImage.secure_url; // Save image URL
      }

      // Thực hiện tạo template
      const createdTemplate = await this.templateService.create(createTemplateDto);
      console.log("Template created successfully:", createdTemplate);

      return createdTemplate;
    } catch (error) {
      // Log chi tiết lỗi
      console.error("Error occurred in create method:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
      });

      // Phân loại lỗi và throw lại lỗi tương ứng
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Link đã được sử dụng bởi một template khác');
      }

      throw new InternalServerErrorException('An error occurred while creating the template');
    }
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get details of a template' })
  @ApiResponse({ status: 200, description: 'Template details' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }
  @Get()
  @ApiOperation({ summary: 'Get all templates by userId with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of templates for a specific user',
  })
  async findAllByUser(
    @Query('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    // Gọi service với userId đã được chuyển đổi
    return this.templateService.findAllByUserId(
      parseInt(userId, 10),
      pageNumber,
      limitNumber,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a template by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        linkName: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiResponse({
    status: 200,
    description: 'Template updated successfully',
    type: templateUser,
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      updateTemplateDto.thumbnailUrl = uploadedImage.secure_url; // Save image URL
    }
    return this.templateService.update(id, updateTemplateDto);
  }
  @Public()
  @Get('/link/:linkName')
  @ApiOperation({ summary: 'Get template by linkName' })
  @ApiResponse({ status: 200, description: 'Template details' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findByLinkName(@Param('linkName') linkName: string) {
    return this.templateService.findByLinkName(linkName);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a template by ID' })
  @ApiResponse({
    status: 204,
    description: 'Template deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Template not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.templateService.remove(id);
  }
}
