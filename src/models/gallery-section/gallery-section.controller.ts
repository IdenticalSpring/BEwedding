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
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Gallery Section')
@Controller('gallery-section')
@ApiBearerAuth('JWT')
export class GallerySectionController {
  constructor(private readonly gallerySectionService: GallerySectionService) {}

  @Post()
  @Public()
  async create(@Body() createGallerySectionDto: CreateGallerySectionDto) {
    return this.gallerySectionService.create(createGallerySectionDto);
  }

  @Get()
  @Public()
  async findAll() {
    return this.gallerySectionService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.gallerySectionService.findOne(id);
  }

  @Put(':id')
  @Public()
  async update(
    @Param('id') id: string,
    @Body() updateGallerySectionDto: UpdateGallerySectionDto,
  ) {
    return this.gallerySectionService.update(id, updateGallerySectionDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    return this.gallerySectionService.remove(id);
  }
}
