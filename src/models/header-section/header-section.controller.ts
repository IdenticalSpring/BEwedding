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

@ApiTags('header-sections')
@Controller('header-sections')
@ApiBearerAuth('JWT')
export class HeaderSectionController {
  constructor(private readonly headerSectionService: HeaderSectionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới phần đầu trang' })
  @ApiResponse({
    status: 201,
    description: 'Phần đầu trang đã được tạo thành công',
    type: HeaderSection,
  })
  create(@Body() createHeaderSectionDto: CreateHeaderSectionDto) {
    return this.headerSectionService.create(createHeaderSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả phần đầu trang' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách các phần đầu trang',
    type: [HeaderSection],
  })
  findAll() {
    return this.headerSectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin phần đầu trang theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin phần đầu trang',
    type: HeaderSection,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phần đầu trang' })
  findOne(@Param('id') id: string) {
    return this.headerSectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật phần đầu trang' })
  @ApiResponse({
    status: 200,
    description: 'Phần đầu trang đã được cập nhật',
    type: HeaderSection,
  })
  update(
    @Param('id') id: string,
    @Body() updateHeaderSectionDto: UpdateHeaderSectionDto,
  ) {
    return this.headerSectionService.update(id, updateHeaderSectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phần đầu trang' })
  @ApiResponse({
    status: 204,
    description: 'Phần đầu trang đã được xóa',
  })
  remove(@Param('id') id: string) {
    return this.headerSectionService.remove(id);
  }
}
