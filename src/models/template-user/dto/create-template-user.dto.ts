// src/template/dto/create-template.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateTemplateUserDto {
  @ApiProperty({
    description: 'Tên mẫu giao diện',
    example: 'Landing Page Template',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'URL hình ảnh xem trước của mẫu',
    example: 'https://example.com/thumbnail.png',
  })
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Mô tả ngắn về mẫu giao diện',
    example: 'A modern landing page template with responsive design.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Tên cô dâu',
  })
  @IsNotEmpty()
  @IsString()
  brideName: string;

  @ApiProperty({
    description: 'Tên chú rể',
  })
  @IsNotEmpty()
  @IsString()
  groomName: string;

  @ApiProperty({
    description: 'Id người dùng',
  })
  @IsOptional()
  userId: number;

  @ApiProperty({
    description: 'Data về templates',
    example: 'A modern landing page template with responsive design.',
  })
  @IsOptional()
  @IsString()
  metaData: string;

  @ApiProperty({
    description: 'Loại truy cập (FREE hoặc VIP)',
    example: 'FREE | VIP',
  })
  @IsNotEmpty()
  @IsEnum(['FREE', 'VIP'])
  accessType: 'FREE' | 'VIP';
}
