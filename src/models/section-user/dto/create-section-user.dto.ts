import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsJSON,
  MaxLength,
} from 'class-validator';

export class CreateSectionUserDto {
  @ApiProperty({ description: 'Tên của section', maxLength: 255 })
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Responsive của section', required: false })
  @IsOptional()
  @IsString()
  responsive?: string;

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
  template_userId?: string;

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
