// src/event-details/dto/create-event-detail.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDate, IsOptional } from 'class-validator';

export class CreateEventDetailDTO {
  @ApiProperty({
    description: 'Mã đám cưới',
    example: 'e6d83fa0-d6b9-4878-8e4e-d1f22c5f9f16',
  })
  @IsUUID()
  weddingId: string;

  @ApiProperty({ description: 'Tên sự kiện', example: 'Lễ cưới' })
  @IsString()
  eventName: string;

  @ApiProperty({
    description: 'Thời gian diễn ra sự kiện',
    example: '2024-12-25T18:00:00Z',
  })
  @IsDate()
  eventDate: Date;

  @ApiProperty({ description: 'Địa điểm tổ chức', example: 'Nhà hàng ABC' })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Miêu tả chi tiết sự kiện',
    example: 'Mô tả chi tiết sự kiện',
  })
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  metaData: string;
}
