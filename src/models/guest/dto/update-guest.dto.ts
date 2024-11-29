import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { GuestStatus } from '../entity/guest.entity';

export class UpdateGuestListDto {
  @ApiProperty({ description: 'Tên khách mời', type: String, required: false })
  @IsOptional()
  @IsString()
  name?: string;

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

  @ApiProperty({
    description: 'Quan hệ với cặp đôi',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiProperty({
    description: 'Trạng thái tham dự',
    enum: GuestStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(GuestStatus)
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
