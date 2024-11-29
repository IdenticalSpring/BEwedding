import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateThemeDto {
  @ApiProperty({ description: 'Mã định danh mẫu giao diện', type: String })
  @IsNotEmpty()
  @IsUUID()
  templateId: string;

  @ApiProperty({ description: 'Tên chủ đề', type: String })
  @IsNotEmpty()
  @IsString()
  themeName: string;

  @ApiProperty({ description: 'Màu chủ đạo', type: String })
  @IsNotEmpty()
  @IsString()
  primaryColor: string;

  @ApiProperty({ description: 'Màu phụ', type: String })
  @IsNotEmpty()
  @IsString()
  secondaryColor: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  metaData: string;
}
