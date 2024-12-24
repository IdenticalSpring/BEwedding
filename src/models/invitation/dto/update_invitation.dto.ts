import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";

export class UpdateInvitationDto {
    @ApiProperty({ description: 'Title of the invitation', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'Message of the invitation', required: false })
    @IsOptional()
    @IsString()
    message?: string;

    @ApiProperty({ description: 'Audience type of the invitation', required: false })
    @IsOptional()
    @IsString()
    audience?: string;
    

    @ApiProperty({ description: 'Metadata associated with the invitation', required: false, type: Object })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
    
}
