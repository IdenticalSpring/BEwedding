import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ description: 'User name', example: 'John Doe' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'User phone number', example: '123456789' })
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ description: 'User address', example: '123 Main Street' })
    @IsNotEmpty()
    address: string;

    @ApiProperty({ description: 'User email', example: 'johndoe@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsNotEmpty()
    password: string;
}
