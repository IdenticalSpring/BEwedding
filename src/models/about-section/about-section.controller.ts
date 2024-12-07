import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateAboutSectionDto } from './dto/create-about-section.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AboutSectionService } from './about-section.service';
import { AboutSection } from './entity/about-section.entity';
import { UpdateAboutSectionDto } from './dto/update-about-section.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('about-sections')
@Controller('about-sections')
@ApiBearerAuth('JWT')
export class AboutSectionController {
  constructor(private readonly aboutSectionService: AboutSectionService) { }

  @Post()
  @Public()
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
  @Public()
  @ApiOperation({ summary: 'Get all about sections' })
  @ApiResponse({
    status: 200,
    description: 'List of all about sections',
    type: [AboutSection],
  })
  findAll() {
    return this.aboutSectionService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get about section by ID' })
  @ApiResponse({
    status: 200,
    description: 'Details of the about section',
    type: AboutSection,
  })
  @ApiResponse({ status: 404, description: 'About section not found' })
  findOne(@Param('id') id: string) {
    return this.aboutSectionService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update an about section' })
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
  @Public()
  @ApiOperation({ summary: 'Delete an about section' })
  @ApiResponse({
    status: 204,
    description: 'The about section has been deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.aboutSectionService.remove(id);
  }
}
