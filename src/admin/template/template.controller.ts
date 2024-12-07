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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TemplateService } from 'src/models/template/template.service';
import { CreateTemplateDto } from 'src/models/template/dto/create-template.dto';
import { UpdateTemplateDto } from 'src/models/template/dto/update-template.dto';
import { Template } from 'src/models/template/entity/template.entity';
import { CloudinaryService } from 'src/models/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('admin/Templates')
@Controller('admin/templates')
@ApiBearerAuth('JWT')
@Roles('admin')
export class AdminTemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  @Roles('admin')
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
    @Body() createTemplateDto: CreateTemplateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      createTemplateDto.thumbnailUrl = uploadedImage.secure_url; // Save image URL
    }
    return this.templateService.create(createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all templates' })
  @ApiResponse({ status: 200, description: 'List of templates' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    return this.templateService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a template by ID' })
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
    type: Template,
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      updateTemplateDto.thumbnailUrl = uploadedImage.secure_url; // Save image URL
    }
    return this.templateService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a template by ID' })
  @ApiResponse({ status: 204, description: 'Template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }
}