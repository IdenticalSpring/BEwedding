import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template-user.controller';
import { TemplateUserService } from './template-user.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BadRequestException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';

describe('TemplateController', () => {
    let controller: TemplateController;
    let templateService: TemplateUserService;
    let cloudinaryService: CloudinaryService;
    let app: INestApplication; // Khai báo app ở cấp độ toàn cục

    const mockTemplateService = {
        create: jest.fn(),
        findOne: jest.fn(),
        findAllByUserId: jest.fn(),
        update: jest.fn(),
    };

    const mockCloudinaryService = {
        uploadImage: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TemplateController],
            providers: [
                { provide: TemplateUserService, useValue: mockTemplateService },
                { provide: CloudinaryService, useValue: mockCloudinaryService },
            ],
        }).compile();

        app = module.createNestApplication(); // Khởi tạo app
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
        await app.init(); // Khởi động app

        controller = module.get<TemplateController>(TemplateController);
    });

    afterEach(async () => {
        await app.close(); // Đóng app sau khi test
    });

    describe('POST /templates_user', () => {
        it('should create a template successfully', async () => {
            const createDto = {
                name: 'New Template',
                description: 'A great template',
                userId: 1,
                brideName: 'Jane Doe',
                groomName: 'John Doe',
                metaData: 'Sample metadata',
                accessType: 'FREE' as 'FREE' | 'VIP',
            };

            const file = { buffer: Buffer.from('image'), mimetype: 'image/png' } as any;

            mockCloudinaryService.uploadImage.mockResolvedValue({ secure_url: 'http://image.com' });
            mockTemplateService.create.mockResolvedValue({
                id: '1',
                ...createDto,
                thumbnailUrl: 'http://image.com', 
            });

            const result = await controller.create(createDto, file);

            expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(file);
            expect(mockTemplateService.create).toHaveBeenCalledWith({
                ...createDto,
                thumbnailUrl: 'http://image.com',
            });
            expect(result).toEqual({ id: '1', ...createDto });
        });
    });

    describe('GET /templates_user/:id', () => {
        it('should return a template by ID', async () => {
            mockTemplateService.findOne.mockResolvedValue({ id: '1', name: 'Template' });
            const result = await controller.findOne('1');

            expect(mockTemplateService.findOne).toHaveBeenCalledWith('1');
            expect(result).toEqual({ id: '1', name: 'Template' });
        });

        it('should throw NotFoundException if template not found', async () => {
            mockTemplateService.findOne.mockRejectedValue(new NotFoundException('Template not found'));
            await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('GET /templates_user?userId', () => {
        it('should return templates for a user with pagination', async () => {
            mockTemplateService.findAllByUserId.mockResolvedValue({
                data: [{ id: '1', name: 'Template' }],
                total: 1,
                page: 1,
                limit: 10,
            });

            const result = await controller.findAllByUser('1', '1', '10');
            expect(mockTemplateService.findAllByUserId).toHaveBeenCalledWith(1, 1, 10);
            expect(result).toEqual({
                data: [{ id: '1', name: 'Template' }],
                total: 1,
                page: 1,
                limit: 10,
            });
        });

        it('should throw BadRequestException if userId is missing', async () => {
            await expect(controller.findAllByUser(undefined, '1', '10')).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('PATCH /templates_user/:id', () => {
        it('should update a template successfully', async () => {
            const updateDto = { name: 'Updated Template' };
            const file = { buffer: Buffer.from('image'), mimetype: 'image/png' } as any;

            mockCloudinaryService.uploadImage.mockResolvedValue({ secure_url: 'http://image-updated.com' });
            mockTemplateService.update.mockResolvedValue({
                id: '1',
                ...updateDto,
                thumbnailUrl: 'http://image-updated.com',
            });

            const result = await controller.update('1', updateDto, file);

            expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(file);
            expect(mockTemplateService.update).toHaveBeenCalledWith('1', {
                ...updateDto,
                thumbnailUrl: 'http://image-updated.com',
            });
            expect(result).toEqual({
                id: '1',
                ...updateDto,
                thumbnailUrl: 'http://image-updated.com',
            });
        });

        it('should throw NotFoundException if template not found', async () => {
            mockTemplateService.update.mockRejectedValue(new NotFoundException('Template not found'));
            await expect(controller.update('999', {}, null)).rejects.toThrow(NotFoundException);
        });
    });
});
