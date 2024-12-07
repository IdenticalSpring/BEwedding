import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateAboutSectionDto } from 'src/models/about-section/dto/create-about-section.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AboutSectionService } from 'src/models/about-section/about-section.service';
import { AboutSection } from 'src/models/about-section/entity/about-section.entity';
import { UpdateAboutSectionDto } from 'src/models/about-section/dto/update-about-section.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('admin/about-sections')
@Controller('admin/about-sections')
@ApiBearerAuth('JWT')
@Roles('admin')
export class AdminAboutSectionController {
  constructor(private readonly aboutSectionService: AboutSectionService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new about section' })
  @ApiResponse({
    status: 201,
    description: 'The about section has been created successfully',
    type: AboutSection,
  })
  create(@Body() createAboutSectionDto: CreateAboutSectionDto) {
    return this.aboutSectionService.create(createAboutSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all about sections' })
  @ApiResponse({
    status: 200,
    description: 'List of about sections',
    type: [AboutSection],
  })
  findAll() {
    return this.aboutSectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get about section by ID' })
  @ApiResponse({
    status: 200,
    description: 'About section information',
    type: AboutSection,
  })
  @ApiResponse({ status: 404, description: 'About section not found' })
  findOne(@Param('id') id: string) {
    return this.aboutSectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update about section' })
  @ApiResponse({
    status: 200,
    description: 'The about section has been updated successfully',
    type: AboutSection,
  })
  update(
    @Param('id') id: string,
    @Body() updateAboutSectionDto: UpdateAboutSectionDto,
  ) {
    return this.aboutSectionService.update(id, updateAboutSectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete about section' })
  @ApiResponse({
    status: 204,
    description: 'The about section has been deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.aboutSectionService.remove(id);
  }
}
