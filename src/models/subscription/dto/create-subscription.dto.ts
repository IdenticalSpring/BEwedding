import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateSubscriptionDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    @IsInt({ message: 'User ID must be an integer' })
    @IsPositive({ message: 'User ID must be a positive number' })
    userId: number;

    @ApiProperty({ description: 'Subscription Plan ID', example: 2 })
    @IsInt({ message: 'Plan ID must be an integer' })
    @IsPositive({ message: 'Plan ID must be a positive number' })
    planId: number;
    @ApiProperty({
        description: 'Confirmation to change the subscription plan if a different active subscription exists',
        example: false,
        required: false,
    })
    @ApiProperty({
        description: 'Confirmation to change the subscription plan if a different active subscription exists',
        example: false,
        required: false,
    })
    @IsOptional() 
    @IsBoolean({ message: 'Confirm change must be a boolean value' })
    confirmChange?: boolean;
}
