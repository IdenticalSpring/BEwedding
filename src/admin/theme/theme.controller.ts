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

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateThemeDto } from 'src/models/theme/dto/create-theme.dto';
import { UpdateThemeDto } from 'src/models/theme/dto/update-theme.dto';
import { ThemeService } from 'src/models/theme/theme.service';

@ApiTags('admin/Themes')
@Controller('admin/themes')
@ApiBearerAuth('JWT')
@Roles('admin')
export class AdminThemeController {
  constructor(private readonly themeService: ThemeService) { }

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
