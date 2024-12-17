import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateSubscriptionDto {
    @ApiProperty({ description: 'Order code of the subscription', example: 123456 })
    @IsNumber({}, { message: 'Order code must be a number' })
    @IsNotEmpty({ message: 'Order code is required' })
    orderCode: number;

    @ApiProperty({ description: 'Payment success status', example: true })
    @IsBoolean({ message: 'Success must be a boolean value' })
    @IsNotEmpty({ message: 'Success status is required' })
    success: boolean;

    @ApiProperty({ description: 'Start date of subscription (optional)', required: false, example: '2023-12-31T00:00:00Z' })
    @IsOptional()
    @IsDateString({}, { message: 'Start date must be a valid ISO 8601 date string' })
    startDate?: Date;

    @ApiProperty({ description: 'End date of subscription (optional)', required: false, example: '2024-12-31T00:00:00Z' })
    @IsOptional()
    @IsDateString({}, { message: 'End date must be a valid ISO 8601 date string' })
    endDate?: Date;
}
