import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateSubscriptionPlanDto {
    @ApiProperty({ example: 'Premium Plan', description: 'Name of the subscription plan' })
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({ example: 'Full access to all features', description: 'Plan description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 29.99, description: 'Price of the plan' })
    @IsNumber()
    @Min(0)
    price: number;
    @ApiProperty({ example: 12, description: 'Duration of the subscription plan in months' })
    @IsNumber()
    @Min(1) 
    duration: number;
}
