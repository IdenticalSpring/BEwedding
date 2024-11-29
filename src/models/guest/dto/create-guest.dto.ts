import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { GuestStatus } from '../entity/guest.entity';

export class CreateGuestListDto {
  @ApiProperty({ description: 'Mã đám cưới liên kết', type: String })
  @IsNotEmpty()
  @IsUUID()
  weddingId: string;

  @ApiProperty({ description: 'Tên khách mời', type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email khách mời',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Số điện thoại khách mời',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Quan hệ với cặp đôi', type: String })
  @IsNotEmpty()
  @IsString()
  relationship: string;

  @ApiProperty({ description: 'Trạng thái tham dự', enum: GuestStatus })
  @IsEnum(GuestStatus)
  @IsOptional()
  status?: GuestStatus;

  @ApiProperty({
    description: 'Ghi chú về khách mời',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Số bàn được chỉ định',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tableNumber?: number;
}
