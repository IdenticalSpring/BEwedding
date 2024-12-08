import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
  BadRequestException,
  UseGuards,
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
import { WeddingDetailService } from 'src/models/wedding-details/wedding-details.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';


@ApiTags('admin/about-sections')
@Controller('admin/about-sections')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminAboutSectionController {
  constructor(private readonly aboutSectionService: AboutSectionService,
    private readonly weddingDetailService: WeddingDetailService, 
  ) 
  { }

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
  async findOne(@Param('id') id: string) {
    const aboutSection = await this.aboutSectionService.findOne(id);
    if (!aboutSection) {
      throw new NotFoundException('About section not found');
    }
    return aboutSection;
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update about section' })
  @ApiResponse({
    status: 200,
    description: 'The about section has been updated successfully',
    type: AboutSection,
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateAboutSectionDto) {
    const aboutSection = await this.aboutSectionService.findOne(id);
    if (!aboutSection) {
      throw new BadRequestException('About section not found');
    }
    return this.aboutSectionService.update(id, updateDto);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete about section' })
  @ApiResponse({
    status: 204,
    description: 'The about section has been deleted successfully',
  })

  async remove(@Param('id') id: string) {
    return this.aboutSectionService.remove(id);
  }

}
