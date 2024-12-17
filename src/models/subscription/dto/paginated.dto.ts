import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
    @ApiProperty({ example: 1, description: 'Page number', required: false })
    @IsInt({ message: 'Page must be an integer' })
    @Min(1, { message: 'Page must be at least 1' })
    @IsOptional()
    page?: number = 1;

    @ApiProperty({ example: 10, description: 'Number of items per page', required: false })
    @IsInt({ message: 'Limit must be an integer' })
    @Min(1, { message: 'Limit must be at least 1' })
    @IsOptional()
    limit?: number = 10;
}
