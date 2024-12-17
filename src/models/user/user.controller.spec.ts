import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Express } from 'express';
import { UserRole } from './entity/user.entity';

describe('UserController', () => {
    let app: INestApplication;
    let userService: UserService;

    const mockUserResponse: UserResponseDto = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        avatar: 'avatar_url',
        role: UserRole.USER,
        dateOfBirth: new Date('1990-01-01'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: '123 Street',
    };

    const mockUserService = {
        findOne: jest.fn().mockResolvedValue(mockUserResponse),
        update: jest.fn().mockResolvedValue(mockUserResponse),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        userService = module.get<UserService>(UserService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('should get user by ID', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/1')
            .expect(200);

        expect(response.body).toEqual({
            ...mockUserResponse,
            dateOfBirth: mockUserResponse.dateOfBirth.toISOString(),
            createdAt: mockUserResponse.createdAt.toISOString(),
            updatedAt: mockUserResponse.updatedAt.toISOString(),
        });
        expect(userService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw error if user not found', async () => {
        jest.spyOn(userService, 'findOne').mockResolvedValue(null);
        const response = await request(app.getHttpServer())
            .get('/users/73612765371263579')
            .expect(404);

        expect(response.body.message).toBe('User not found');
    });

    it('should update user by ID', async () => {
        const updateUserDto: UpdateUserDto = { name: 'Jane Doe' };
        const avatarFile: Express.Multer.File = {
            fieldname: 'avatar',
            originalname: 'avatar.png',
            encoding: '7bit',
            mimetype: 'image/png',
            size: 1024,
            buffer: Buffer.from('file content'),
            stream: null,
            destination: '',
            filename: '',
            path: '',
        };

        const response = await request(app.getHttpServer())
            .put('/users/1')
            .field('name', updateUserDto.name)
            .attach('avatar', Buffer.from(''), 'avatar.png')
            .expect(200);

        expect(response.body).toEqual({
            ...mockUserResponse,
            dateOfBirth: mockUserResponse.dateOfBirth.toISOString(),
            createdAt: mockUserResponse.createdAt.toISOString(),
            updatedAt: mockUserResponse.updatedAt.toISOString(),
        });
        expect(userService.update).toHaveBeenCalledWith(1, updateUserDto, expect.any(Object));

    });

    it('should throw error if invalid file type for avatar', async () => {
        const updateUserDto: UpdateUserDto = { name: 'Jane Doe' };

        const response = await request(app.getHttpServer())
            .put('/users/1')
            .field('name', updateUserDto.name)
            .attach('avatar', Buffer.from(''), 'avatar.txt')
            .expect(404);

        expect(response.body.message).toBe('Invalid file type for avatar');
    });

    it('should return 400 if no avatar file is provided', async () => {
        const updateUserDto: UpdateUserDto = { name: 'Jane Doe' };

        const response = await request(app.getHttpServer())
            .put('/users/1')
            .field('name', updateUserDto.name)
            .expect(200);

        expect(response.body).toEqual({
            ...mockUserResponse,
            dateOfBirth: mockUserResponse.dateOfBirth.toISOString(),
            createdAt: mockUserResponse.createdAt.toISOString(),
            updatedAt: mockUserResponse.updatedAt.toISOString(),
        });
        expect(userService.update).toHaveBeenCalledWith(1, updateUserDto, undefined);
    });

    it('should return 400 if invalid ID is provided', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/invalid-id')
            .expect(400);

        expect(response.body.message).toBe('Validation failed (numeric string is expected)');
    });
});