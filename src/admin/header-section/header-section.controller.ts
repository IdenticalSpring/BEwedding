import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { HeaderSectionService } from 'src/models/header-section/header-section.service';
import { CreateHeaderSectionDto } from 'src/models/header-section/dto/create-header-section.dto';
import { UpdateHeaderSectionDto } from 'src/models/header-section/dto/update-header-section.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HeaderSection } from 'src/models/header-section/entity/header-section.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('admin/header-sections')
@Controller('admin/header-sections')
@ApiBearerAuth('JWT')
@Roles('admin')
export class AdminHeaderSectionController {
  constructor(private readonly headerSectionService: HeaderSectionService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new header section' })
  @ApiResponse({
    status: 201,
    description: 'The header section has been successfully created',
    type: HeaderSection,
  })
  async create(@Body() createHeaderSectionDto: CreateHeaderSectionDto) {
    return this.headerSectionService.create(createHeaderSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all header sections' })
  @ApiResponse({
    status: 200,
    description: 'List of all header sections',
    type: [HeaderSection],
  })
  async findAll() {
    return this.headerSectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get header section by ID' })
  @ApiResponse({
    status: 200,
    description: 'Header section details',
    type: HeaderSection,
  })
  @ApiResponse({ status: 404, description: 'Header section not found' })
  async findOne(@Param('id') id: string) {
    const headerSection = await this.headerSectionService.findOne(id);
    if (!headerSection) {
      throw new NotFoundException('Header section not found');
    }
    return headerSection;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update header section' })
  @ApiResponse({
    status: 200,
    description: 'Header section has been successfully updated',
    type: HeaderSection,
  })
  async update(
    @Param('id') id: string,
    @Body() updateHeaderSectionDto: UpdateHeaderSectionDto,
  ) {
    const updatedHeaderSection = await this.headerSectionService.update(id, updateHeaderSectionDto);
    if (!updatedHeaderSection) {
      throw new NotFoundException('Header section not found');
    }
    return updatedHeaderSection;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete header section' })
  @ApiResponse({
    status: 204,
    description: 'Header section has been successfully deleted',
  })

  async remove(@Param('id') id: string) {
    const result = await this.headerSectionService.remove(id);
    if (result === null) {
      throw new NotFoundException('Header section not found');
    }
  }

}