import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { GallerySectionService } from './gallery-section.service';
import { CreateGallerySectionDto } from './dto/create-gallery-section.dto';
import { UpdateGallerySectionDto } from './dto/update-gallery-section.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Gallery Section')
@Controller('gallery-section')
@ApiBearerAuth('JWT')
export class GallerySectionController {
  constructor(private readonly gallerySectionService: GallerySectionService) {}

  @Post()
  async create(@Body() createGallerySectionDto: CreateGallerySectionDto) {
    return this.gallerySectionService.create(createGallerySectionDto);
  }

  @Get()
  async findAll() {
    return this.gallerySectionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.gallerySectionService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGallerySectionDto: UpdateGallerySectionDto,
  ) {
    return this.gallerySectionService.update(id, updateGallerySectionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.gallerySectionService.remove(id);
  }
}
