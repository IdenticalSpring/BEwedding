import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { HeaderSectionService } from './header-section.service';
import { CreateHeaderSectionDto } from './dto/create-header-section.dto';
import { UpdateHeaderSectionDto } from './dto/update-header-section.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HeaderSection } from './entity/header-section.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('header-sections')
@Controller('header-sections')
@ApiBearerAuth('JWT')
export class HeaderSectionController {
  constructor(private readonly headerSectionService: HeaderSectionService) { }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new header section' })
  @ApiResponse({
    status: 201,
    description: 'The header section was created successfully',
    type: HeaderSection,
  })
  create(@Body() createHeaderSectionDto: CreateHeaderSectionDto) {
    return this.headerSectionService.create(createHeaderSectionDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all header sections' })
  @ApiResponse({
    status: 200,
    description: 'List of header sections',
    type: [HeaderSection],
  })
  findAll() {
    return this.headerSectionService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a header section by ID' })
  @ApiResponse({
    status: 200,
    description: 'Details of the header section',
    type: HeaderSection,
  })
  @ApiResponse({ status: 404, description: 'Header section not found' })
  findOne(@Param('id') id: string) {
    return this.headerSectionService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update a header section' })
  @ApiResponse({
    status: 200,
    description: 'The header section was updated successfully',
    type: HeaderSection,
  })
  update(
    @Param('id') id: string,
    @Body() updateHeaderSectionDto: UpdateHeaderSectionDto,
  ) {
    return this.headerSectionService.update(id, updateHeaderSectionDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete a header section' })
  @ApiResponse({
    status: 204,
    description: 'The header section was deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.headerSectionService.remove(id);
  }
}
