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
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Tạo mới một section' })
  @ApiResponse({
    status: 201,
    description: 'Section đã được tạo.',
    type: Section,
  })
  async create(@Body() createSectionDto: CreateSectionDto): Promise<Section> {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy tất cả các section' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách các section.',
    type: [Section],
  })
  async findAll(): Promise<Section[]> {
    return this.sectionService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết một section theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết section.', type: Section })
  async findOne(@Param('id') id: number): Promise<Section> {
    return this.sectionService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Cập nhật thông tin một section theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Section đã được cập nhật.',
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
  @ApiOperation({ summary: 'Xóa một section theo ID' })
  @ApiResponse({ status: 200, description: 'Section đã được xóa.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.sectionService.remove(id);
  }
}
