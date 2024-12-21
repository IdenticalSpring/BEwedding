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
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SubscriptionService } from '../subscription/subscription.service';


@ApiTags('Templates')
@Controller('templates')
@ApiBearerAuth('JWT')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly subscriptionService: SubscriptionService,
  ) { }


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
  @Get('edit/:id/user/:userId')
  @ApiOperation({ summary: 'Get details of a template and check user subscription' })
  @ApiResponse({ status: 200, description: 'Template details with subscription check' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiResponse({ status: 403, description: 'Access denied: User does not have valid subscription' })
  async findOneEdit(
    @Param('id') id: string,
    @Param('userId') userId: number,
  ) {
    const template = await this.templateService.findOne(id);

    if (!template) {
      throw new BadRequestException(`Template with ID ${id} not found`);
    }

    // Kiểm tra gói đăng ký hợp lệ
    const hasValidSubscription = await this.subscriptionService.hasValidSubscription(userId);

    if (template.subscriptionPlan?.id !== 1 && !hasValidSubscription) {
      throw new BadRequestException(
        'Access denied: You need a valid subscription to access this template.',
      );
    }

    return template;
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a template' })
  @ApiResponse({ status: 200, description: 'Template details' })
   @ApiResponse({ status: 404, description: 'Template not found' })
  async findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }
}
