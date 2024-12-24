import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsObject } from 'class-validator';

export class CreateInvitationDto {
    @ApiProperty({ description: 'Title of the invitation' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Message of the invitation', required: false })
    @IsOptional()
    @IsString()
    message?: string;

    @ApiProperty({ description: 'Audience type of the invitation', required: false })
    @IsOptional()
    @IsString()
    audience?: string;

    @ApiProperty({ description: 'Template User ID associated with the invitation' })
    @IsUUID()
    template_userId: string;

    @ApiProperty({ description: 'Metadata associated with the invitation', required: false, type: Object })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}