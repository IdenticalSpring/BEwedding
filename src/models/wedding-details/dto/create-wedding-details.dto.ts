// src/wedding-details/dto/create-wedding-detail.dto.ts
import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWeddingDetailDto {
  @ApiProperty({ description: 'Tên cô dâu' })
  @IsString()
  brideName: string;

  @ApiProperty({ description: 'Tên chú rể' })
  @IsString()
  groomName: string;

  @ApiProperty({
    description: 'Ngày tổ chức sự kiện',
    type: String,
    format: 'date',
  })
  @IsDateString()
  eventDate: Date;

  @ApiProperty({ description: 'Địa điểm tổ chức đám cưới' })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Thông tin tài khoản ngân hàng (nếu có)',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiProperty({ description: 'Địa chỉ ví điện tử (nếu có)', required: false })
  @IsOptional()
  @IsString()
  cryptoWallet?: string;

  @ApiProperty()
  @IsString()
  metaData?: string;

  @ApiProperty({ description: 'Template ID liên kết', required: false })
  @IsOptional()
  @IsString()
  template_userId?: string;
}
