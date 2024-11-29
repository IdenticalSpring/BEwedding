import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ description: 'User name', example: 'John Doe' })
    name: string;

    @ApiProperty({ description: 'User phone number', example: '123456789' })
    phone: string;

    @ApiProperty({ description: 'User address', example: '123 Main Street' })
    address: string;

    @ApiProperty({ description: 'User email', example: 'johndoe@example.com' })
    email: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    password: string;
}
