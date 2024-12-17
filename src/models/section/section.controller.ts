import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
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
  @ApiOperation({ summary: 'Get a section by ID' })
  @ApiResponse({ status: 200, description: 'Details of the section.', type: Section })
  @ApiResponse({ status: 404, description: 'Section not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Section> {
    return this.sectionService.findOne(id);
  }
}
