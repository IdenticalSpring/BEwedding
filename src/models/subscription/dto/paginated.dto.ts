import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional } from 'class-validator';

export class PaginationQueryDto {
    @ApiProperty({
        description: 'Page number',
        example: 1,
        required: false,
    })
    @IsOptional()
    page: number;
    @ApiProperty({
        description: 'Limit per page',
        example: 10,
        required: false,
    })
    @IsOptional()

    limit: number;
}
