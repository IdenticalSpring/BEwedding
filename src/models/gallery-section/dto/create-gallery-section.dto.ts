import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateGallerySectionDto {
  @ApiProperty({ description: 'Mã định danh đám cưới', type: String })
  @IsNotEmpty()
  @IsString()
  weddingId: string;

  @ApiProperty({ description: 'URL của các ảnh trong album', type: [String] })
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  metaData: string;
}
