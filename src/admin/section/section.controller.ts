import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SectionService } from 'src/models/section/section.service';
import { CreateSectionDto } from 'src/models/section/dto/create-section.dto';
import { UpdateSectionDto } from 'src/models/section/dto/update-section.dto';
import { Section } from 'src/models/section/entity/section.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';

@ApiTags('admin/sections')
@Controller('admin/sections')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminSectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({
    status: 201,
    description: 'The section has been created.',
    type: Section,
  })
  async create(@Body() createSectionDto: CreateSectionDto): Promise<Section> {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sections' })
  @ApiResponse({
    status: 200,
    description: 'List of all sections.',
    type: [Section],
  })
  async findAll(): Promise<Section[]> {
    return this.sectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get section details by ID' })
  @ApiResponse({ status: 200, description: 'Section details.', type: Section })
  async findOne(@Param('id') id: string): Promise<Section> {
    return this.sectionService.findOne(id);
  }

  @Get('template/:templateId')
  @ApiOperation({ summary: 'Get sections by template ID' })
  @ApiResponse({
    status: 200,
    description: 'List of sections linked to the specified template ID.',
    type: [Section],
  })
  async findByTemplateId(
    @Param('templateId') templateId: string,
  ): Promise<Section[]> {
    return this.sectionService.findByTemplateId(templateId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update section details by ID' })
  @ApiResponse({
    status: 200,
    description: 'The section has been updated.',
    type: Section,
  })
  async update(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    return this.sectionService.update(id, updateSectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete section by ID' })
  @ApiResponse({ status: 200, description: 'The section has been deleted.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.sectionService.remove(id);
  }
}
