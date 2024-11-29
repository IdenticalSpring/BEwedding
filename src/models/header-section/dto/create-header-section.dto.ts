import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHeaderSectionDto {
  @ApiProperty({
    description: 'Liên kết đến đám cưới',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  weddingId: string;

  @ApiProperty({
    description: 'Tiêu đề chính của phần đầu trang',
    example: 'Đám cưới của A & B',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Dòng mô tả ngắn cho phần đầu trang',
    example: 'Cùng nhau bắt đầu hành trình',
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    description: 'URL ảnh nền của tiêu đề',
    example: 'https://example.com/background.jpg',
  })
  @IsString()
  backgroundUrl: string;

  @ApiProperty()
  @IsString()
  metaData: string;
}
