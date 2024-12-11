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
import { templateUser } from './entity/template-user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateTemplateUserDto } from './dto/update-template-user.dto';

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
        thumbnail: { type: 'string', format: 'binary' },
        accessType: { type: 'string' },
        metaData: { type: 'string' },
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
    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      createTemplateDto.thumbnailUrl = uploadedImage.secure_url; // Save image URL
    }
    return this.templateService.create(createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  @ApiResponse({ status: 200, description: 'List of all templates' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    return this.templateService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a template' })
  @ApiResponse({ status: 200, description: 'Template details' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
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
}
