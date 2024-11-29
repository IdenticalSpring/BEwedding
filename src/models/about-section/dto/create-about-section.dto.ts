import { IsString, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAboutSectionDto {
  @ApiProperty({
    description: 'Liên kết đến đám cưới',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  weddingId: string;

  @ApiProperty({
    description: 'Giới thiệu về cô dâu',
    example: 'Cô dâu là một người thông minh và xinh đẹp...',
  })
  @IsString()
  brideBio: string;

  @ApiProperty({
    description: 'Giới thiệu về chú rể',
    example: 'Chú rể là một người chân thành và nhiệt huyết...',
  })
  @IsString()
  groomBio: string;

  @ApiProperty({
    description: 'Danh sách URL ảnh liên quan',
    example: ['https://example.com/bride.jpg', 'https://example.com/groom.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @ApiProperty()
  @IsString()
  metaData: string;
}
