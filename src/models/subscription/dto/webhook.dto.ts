import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsObject } from 'class-validator';

export class PayOSWebhookDto {
    @ApiProperty({ description: 'Unique order code', example: 123456 })
    @IsNumber({}, { message: 'Order code must be a number' })
    @IsNotEmpty({ message: 'Order code is required' })
    orderCode: number;

    @ApiProperty({ description: 'Payment success status', example: true })
    @IsBoolean({ message: 'Success must be a boolean' }) 
    @IsNotEmpty({ message: 'Success status is required' }) 
    success: boolean;

    @ApiProperty({ description: 'Other optional data', type: Object, required: false })
    @IsOptional() 
    @IsObject({ message: 'Data must be an object' })
    data?: any;
}
