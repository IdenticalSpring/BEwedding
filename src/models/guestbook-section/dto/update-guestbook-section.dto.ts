import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGuestbookSectionDto {
  @ApiProperty({ description: 'Tên khách mời', type: String, required: false })
  @IsOptional()
  @IsString()
  guestName: string;

  @ApiProperty({
    description: 'Lời chúc hoặc bình luận',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  message: string;
}
