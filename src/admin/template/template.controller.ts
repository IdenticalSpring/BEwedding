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
  InternalServerErrorException,
  NotFoundException,
  Logger,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';

@ApiTags('admin/Templates')
@Controller('admin/templates')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminTemplateController {
  private readonly logger = new Logger(AdminTemplateController.name);
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
        subscriptionPlanId: { type: 'integer' },
        metaData: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file && !createTemplateDto.thumbnailUrl) {
      throw new BadRequestException('Thumbnail is required.');
    }

    try {
      // If a file is provided, upload it to Cloudinary
      if (file) {
        const uploadedImage = await this.cloudinaryService.uploadImage(file);
        createTemplateDto.thumbnailUrl = uploadedImage.secure_url;
      }

      // Save the template to the database
      const result = await this.templateService.create(createTemplateDto);
      return result;
    } catch (error) {
      // Log the error before throwing the exception
      this.logger.error('Error creating template:', error.stack);
      throw new InternalServerErrorException('Failed to create template.');
    }
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
        subscriptionPlanId: { type: 'integer' },
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
    try {
      // Nếu file được truyền qua, upload và cập nhật URL
      if (file) {
        const uploadedImage = await this.cloudinaryService.uploadImage(file);
        updateTemplateDto.thumbnailUrl = uploadedImage.secure_url; // Save new image URL
      } else {
        // Giữ nguyên thumbnailUrl nếu không có file mới
        const existingTemplate = await this.templateService.findOne(id);
        if (!existingTemplate) {
          throw new NotFoundException('Template not found');
        }
        updateTemplateDto.thumbnailUrl = existingTemplate.thumbnailUrl;
      }

      // Cập nhật dữ liệu trong database
      return await this.templateService.update(id, updateTemplateDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update the template.',
      );
    }
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
