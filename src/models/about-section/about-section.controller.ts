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
  constructor(private readonly aboutSectionService: AboutSectionService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Tạo mới phần giới thiệu' })
  @ApiResponse({
    status: 201,
    description: 'Phần giới thiệu đã được tạo thành công',
    type: AboutSection,
  })
  create(@Body() createAboutSectionDto: CreateAboutSectionDto) {
    return this.aboutSectionService.create(createAboutSectionDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy tất cả phần giới thiệu' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách các phần giới thiệu',
    type: [AboutSection],
  })
  findAll() {
    return this.aboutSectionService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin phần giới thiệu theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin phần giới thiệu',
    type: AboutSection,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phần giới thiệu' })
  findOne(@Param('id') id: string) {
    return this.aboutSectionService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Cập nhật phần giới thiệu' })
  @ApiResponse({
    status: 200,
    description: 'Phần giới thiệu đã được cập nhật',
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
  @ApiOperation({ summary: 'Xóa phần giới thiệu' })
  @ApiResponse({
    status: 204,
    description: 'Phần giới thiệu đã được xóa',
  })
  remove(@Param('id') id: string) {
    return this.aboutSectionService.remove(id);
  }
}
