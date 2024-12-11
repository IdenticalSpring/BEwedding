import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsJSON,
  MaxLength,
} from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ description: 'Tên của section', maxLength: 255 })
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Style của section', required: false })
  @IsOptional()
  @IsString()
  style?: Record<string, any>;

  @ApiProperty({
    description: 'Theme của section',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  theme?: string;

  @ApiProperty({ description: 'Template ID liên kết', required: false })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({ description: 'Vị trí hiển thị của section', required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    description: 'Metadata (JSON)',
    required: false,
    example: { key: 'value' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
