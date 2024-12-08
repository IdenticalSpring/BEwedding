import { Test, TestingModule } from '@nestjs/testing';
import { AdminHeaderSectionController } from './header-section.controller';
import { HeaderSectionService } from 'src/models/header-section/header-section.service';
import { CreateHeaderSectionDto } from 'src/models/header-section/dto/create-header-section.dto';
import { UpdateHeaderSectionDto } from 'src/models/header-section/dto/update-header-section.dto';
import { HeaderSection } from 'src/models/header-section/entity/header-section.entity';
import { NotFoundException } from '@nestjs/common';

describe('AdminHeaderSectionController', () => {
    let controller: AdminHeaderSectionController;
    let service: HeaderSectionService;

    const mockHeaderSectionService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminHeaderSectionController],
            providers: [
                {
                    provide: HeaderSectionService,
                    useValue: mockHeaderSectionService,
                },
            ],
        }).compile();

        controller = module.get<AdminHeaderSectionController>(AdminHeaderSectionController);
        service = module.get<HeaderSectionService>(HeaderSectionService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new header section', async () => {
            const createDto: CreateHeaderSectionDto = {
                weddingId: '123e4567-e89b-12d3-a456-426614174000',
                title: 'Wedding of A & B',
                subtitle: 'Join us for the big day',
                backgroundUrl: 'https://example.com/background.jpg',
                metaData: 'Some metadata',
            };

            const result: HeaderSection = {
                id: '1',
                weddingDetail: null,
                title: 'Wedding of A & B',
                subtitle: 'Join us for the big day',
                backgroundUrl: 'https://example.com/background.jpg',
                metaData: 'Some metadata',
            };

            mockHeaderSectionService.create.mockResolvedValue(result);

            expect(await controller.create(createDto)).toEqual(result);
            expect(mockHeaderSectionService.create).toHaveBeenCalledWith(createDto);
        });

        it('should throw an error if wedding detail not found', async () => {
            const createDto: CreateHeaderSectionDto = {
                weddingId: 'invalid-id',
                title: 'Wedding of A & B',
                subtitle: 'Join us for the big day',
                backgroundUrl: 'https://example.com/background.jpg',
                metaData: 'Some metadata',
            };

            mockHeaderSectionService.create.mockRejectedValue(new Error('Wedding details not found'));

            await expect(controller.create(createDto)).rejects.toThrowError('Wedding details not found');
        });
    });

    describe('findOne', () => {
        it('should return a header section by ID', async () => {
            const result: HeaderSection = {
                id: '1',
                weddingDetail: null,
                title: 'Wedding of A & B',
                subtitle: 'Join us for the big day',
                backgroundUrl: 'https://example.com/background.jpg',
                metaData: 'Some metadata',
            };

            mockHeaderSectionService.findOne.mockResolvedValue(result);

            expect(await controller.findOne('1')).toEqual(result);
            expect(mockHeaderSectionService.findOne).toHaveBeenCalledWith('1');
        });

        it('should return 404 if header section not found', async () => {
            mockHeaderSectionService.findOne.mockResolvedValue(null);

            await expect(controller.findOne('nonexistent-id')).rejects.toThrowError(
                new NotFoundException('Header section not found'),
            );
        });
    });

    describe('update', () => {
        it('should update a header section by ID', async () => {
            const updateDto: UpdateHeaderSectionDto = {
                title: 'Updated Wedding Title',
                subtitle: 'Updated subtitle',
            };

            const result: HeaderSection = {
                id: '1',
                weddingDetail: null,
                title: 'Updated Wedding Title',
                subtitle: 'Updated subtitle',
                backgroundUrl: 'https://example.com/background.jpg',
                metaData: 'Some metadata',
            };

            mockHeaderSectionService.update.mockResolvedValue(result);

            expect(await controller.update('1', updateDto)).toEqual(result);
            expect(mockHeaderSectionService.update).toHaveBeenCalledWith('1', updateDto);
        });

        it('should return 404 if header section not found for update', async () => {
            const updateDto: UpdateHeaderSectionDto = {
                title: 'Updated Wedding Title',
            };

            mockHeaderSectionService.update.mockResolvedValue(null);

            await expect(controller.update('nonexistent-id', updateDto)).rejects.toThrowError(
                new NotFoundException('Header section not found'),
            );
        });
    });

    describe('remove', () => {
        it('should remove a header section by ID', async () => {
            mockHeaderSectionService.remove.mockResolvedValue(undefined);

            await expect(controller.remove('1')).resolves.toBeUndefined();
            expect(mockHeaderSectionService.remove).toHaveBeenCalledWith('1');
        });

        it('should return 404 if header section not found for removal', async () => {
            mockHeaderSectionService.remove.mockResolvedValue(null);

            await expect(controller.remove('nonexistent-id')).rejects.toThrowError(
                new NotFoundException('Header section not found'),
            );
        });
    });
});
