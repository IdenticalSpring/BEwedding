import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateThemeDto {
  @ApiProperty({ description: 'Tên chủ đề', type: String, required: false })
  @IsOptional()
  @IsString()
  themeName: string;

  @ApiProperty({ description: 'Màu chủ đạo', type: String, required: false })
  @IsOptional()
  @IsString()
  primaryColor: string;

  @ApiProperty({ description: 'Màu phụ', type: String, required: false })
  @IsOptional()
  @IsString()
  secondaryColor: string;
}
