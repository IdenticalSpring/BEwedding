import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GallerySectionService } from 'src/models/gallery-section/gallery-section.service';
import { CreateGallerySectionDto } from 'src/models/gallery-section/dto/create-gallery-section.dto';
import { UpdateGallerySectionDto } from 'src/models/gallery-section/dto/update-gallery-section.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';

@ApiTags('admin/Gallery Section')
@Controller('admin/gallery-section')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminGallerySectionController {
  constructor(private readonly gallerySectionService: GallerySectionService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new gallery section' })
  @ApiResponse({
    status: 201,
    description: 'The gallery section has been successfully created.',
  })
  async create(@Body() createGallerySectionDto: CreateGallerySectionDto) {
    return this.gallerySectionService.create(createGallerySectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gallery sections' })
  @ApiResponse({ status: 200, description: 'Return all gallery sections' })
  async findAll() {
    return this.gallerySectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a gallery section by id' })
  @ApiResponse({ status: 200, description: 'Return the gallery section' })
  @ApiResponse({ status: 404, description: 'Gallery section not found' })
  async findOne(@Param('id') id: string) {
    return this.gallerySectionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a gallery section by id' })
  @ApiResponse({
    status: 200,
    description: 'The gallery section has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Gallery section not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGallerySectionDto: UpdateGallerySectionDto,
  ) {
    return this.gallerySectionService.update(id, updateGallerySectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gallery section by id' })
  @ApiResponse({
    status: 200,
    description: 'The gallery section has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Gallery section not found' })
  async remove(@Param('id') id: string) {
    return this.gallerySectionService.remove(id);
  }
}
