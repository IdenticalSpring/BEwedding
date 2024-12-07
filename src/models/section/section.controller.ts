import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entity/section.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('sections')
@Controller('sections')
@ApiBearerAuth('JWT')
export class SectionController {
  constructor(private readonly sectionService: SectionService) { }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({
    status: 201,
    description: 'The section was created successfully.',
    type: Section,
  })
  async create(@Body() createSectionDto: CreateSectionDto): Promise<Section> {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  @Public()
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
  @Public()
  @ApiOperation({ summary: 'Get a section by ID' })
  @ApiResponse({ status: 200, description: 'Details of the section.', type: Section })
  async findOne(@Param('id') id: number): Promise<Section> {
    return this.sectionService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update a section by ID' })
  @ApiResponse({
    status: 200,
    description: 'The section was updated successfully.',
    type: Section,
  })
  async update(
    @Param('id') id: number,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    return this.sectionService.update(id, updateSectionDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete a section by ID' })
  @ApiResponse({ status: 200, description: 'The section was deleted successfully.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.sectionService.remove(id);
  }
}
