import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ThemeService } from './theme.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Themes')
@Controller('themes')
@ApiBearerAuth('JWT')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}
  @Post()
  async create(@Body() createThemeDto: CreateThemeDto) {
    return this.themeService.create(createThemeDto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Math.min(100, Number(limit)));

    return this.themeService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.themeService.findOne(id);  
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateThemeDto: UpdateThemeDto,
  ) {
    return this.themeService.update(id, updateThemeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.themeService.remove(id);  
  }
}
