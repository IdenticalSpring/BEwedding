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
import { TemplateUserService } from './template-user.service';
import { CreateTemplateUserDto } from './dto/create-template-user.dto';
import { UpdateTemplateUserDto } from './dto/update-template-user.dto';
import { TemplateUser } from './entity/template-user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Templates')
@Controller('templates')
@ApiBearerAuth('JWT')
export class TemplateUserController {
  constructor(
    private readonly templateUserService: TemplateUserService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }



  @Get(':id')
  @ApiOperation({ summary: 'Get details of a template' })
  @ApiResponse({ status: 200, description: 'Template details' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findOne(@Param('id') id: string) {
    return this.templateUserService.findOne(id);
  }
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
        thumbnail: { type: 'string', format: 'binary' },
        accessType: { type: 'string' },
        metaData: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UseInterceptors(FileInterceptor('thumbnail')) 
  async create(
    @Body() createTemplateDto: CreateTemplateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      createTemplateDto.thumbnailUrl = uploadedImage.secure_url;
    }
    return this.templateUserService.create(createTemplateDto);
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
        thumbnail: { type: 'string', format: 'binary' },
        accessType: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiResponse({
    status: 200,
    description: 'Template updated successfully',
    type: TemplateUser,
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      updateTemplateDto.thumbnailUrl = uploadedImage.secure_url; 
    }
    return this.templateUserService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a template by ID' })
  @ApiResponse({ status: 204, description: 'Template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async remove(@Param('id') id: string) {
    return this.templateUserService.remove(id);
  }
}
