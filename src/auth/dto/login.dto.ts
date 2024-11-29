import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Email or phone number of the user',
        example: 'johndoe@example.com',
    })
    identifier: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'password123',
    })
    password: string;
}
