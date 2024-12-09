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
import { SectionUserService } from './section-user.service';
import { CreateSectionUserDto } from './dto/create-section-user.dto';
import { UpdateSectionUserDto } from './dto/update-section-user.dto';
import { SectionUser } from './entity/section-user.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('sectionsUser')
@Controller('sectionsUser')
@ApiBearerAuth('JWT')
export class SectionUserController {
  constructor(private readonly sectionService: SectionUserService) { }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({
    status: 201,
    description: 'The section was created successfully.',
    type: SectionUser,
  })
  async create(@Body() createSectionDto: CreateSectionUserDto): Promise<SectionUser> {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all sections' })
  @ApiResponse({
    status: 200,
    description: 'List of all sections.',
    type: [SectionUser],
  })
  async findAll(): Promise<SectionUser[]> {
    return this.sectionService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a section by ID' })
  @ApiResponse({ status: 200, description: 'Details of the section.', type: SectionUser })
  async findOne(@Param('id') id: number): Promise<SectionUser> {
    return this.sectionService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update a section by ID' })
  @ApiResponse({
    status: 200,
    description: 'The section was updated successfully.',
    type: SectionUser,
  })
  async update(
    @Param('id') id: number,
    @Body() updateSectionDto: UpdateSectionUserDto,
  ): Promise<SectionUser> {
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
