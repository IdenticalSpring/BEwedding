import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGuestbookSectionDto {
  @ApiProperty({ description: 'Mã định danh đám cưới', type: String })
  @IsNotEmpty()
  @IsUUID()
  weddingId: string;

  @ApiProperty({ description: 'Tên khách mời', type: String })
  @IsNotEmpty()
  @IsString()
  guestName: string;

  @ApiProperty({ description: 'Lời chúc hoặc bình luận', type: String })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  metaData: string;
}
