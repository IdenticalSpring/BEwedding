// src/wedding-details/wedding-detail.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WeddingDetailService } from './wedding-details.service';
import { WeddingDetail } from './entity/wedding-details.entity';
import { CreateWeddingDetailDto } from './dto/create-wedding-details.dto';
import { UpdateWeddingDetailDto } from './dto/update-wedding-details.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('wedding-details')
@Controller('wedding-details')
@ApiBearerAuth('JWT')
export class WeddingDetailController {
  constructor(private readonly weddingDetailService: WeddingDetailService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo mới thông tin đám cưới' })
  @ApiResponse({
    status: 201,
    description: 'Đám cưới đã được tạo thành công',
    type: WeddingDetail,
  })
  create(@Body() createDto: CreateWeddingDetailDto) {
    return this.weddingDetailService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả thông tin đám cưới hoặc theo User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách thông tin đám cưới',
    type: [WeddingDetail],
  })
  async findAll(@Query('userId') userId?: number) {
    if (userId) {
      return this.weddingDetailService.findAllByUserId(userId);
    }
    return this.weddingDetailService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đám cưới theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin đám cưới',
    type: WeddingDetail,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đám cưới' })
  async findOne(@Param('id') id: string) {
    const weddingDetail = await this.weddingDetailService.findOne(id);
    if (!weddingDetail) {
      throw new NotFoundException(`Wedding detail with ID ${id} not found`);
    }
    return weddingDetail;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin đám cưới' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin đám cưới đã được cập nhật',
    type: WeddingDetail,
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateWeddingDetailDto) {
    return this.weddingDetailService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa thông tin đám cưới' })
  @ApiResponse({
    status: 204,
    description: 'Đám cưới đã được xóa',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đám cưới' })
  remove(@Param('id') id: string) {
    return this.weddingDetailService.remove(id);
  }
}
