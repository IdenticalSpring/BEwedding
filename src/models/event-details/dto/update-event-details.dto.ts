// src/event-details/dto/update-event-detail.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDate, IsOptional } from 'class-validator';

export class UpdateEventDetailDTO {
  @ApiProperty({
    description: 'Tên sự kiện',
    example: 'Tiệc chính',
    required: false,
  })
  @IsString()
  @IsOptional()
  eventName?: string;

  @ApiProperty({
    description: 'Thời gian diễn ra sự kiện',
    example: '2024-12-25T20:00:00Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  eventDate?: Date;

  @ApiProperty({
    description: 'Địa điểm tổ chức',
    example: 'Nhà hàng XYZ',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Miêu tả chi tiết sự kiện',
    example: 'Mô tả chi tiết sự kiện',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
