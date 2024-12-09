import { Test, TestingModule } from '@nestjs/testing';
import { AdminGallerySectionController } from './gallery-section.controller';
import { GallerySectionService } from 'src/models/gallery-section/gallery-section.service';
import { CreateGallerySectionDto } from 'src/models/gallery-section/dto/create-gallery-section.dto';
import { UpdateGallerySectionDto } from 'src/models/gallery-section/dto/update-gallery-section.dto';
import { GallerySection } from 'src/models/gallery-section/entity/gallery-section.entity';

describe('AdminGallerySectionController', () => {
    let controller: AdminGallerySectionController;
    let service: GallerySectionService;

    const mockGallerySectionService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminGallerySectionController],
            providers: [
                {
                    provide: GallerySectionService,
                    useValue: mockGallerySectionService,
                },
            ],
        }).compile();

        controller = module.get<AdminGallerySectionController>(
            AdminGallerySectionController,
        );
        service = module.get<GallerySectionService>(GallerySectionService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new gallery section', async () => {
            const createDto: CreateGallerySectionDto = {
                weddingId: '123',
                imageUrls: ['url1', 'url2'],
                metaData: '{}',
            };

            const result: GallerySection = {
                id: '1',
                ...createDto,
                weddingDetail: null,
            };

            mockGallerySectionService.create.mockResolvedValue(result);

            expect(await controller.create(createDto)).toEqual(result);
            expect(mockGallerySectionService.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('findAll', () => {
        it('should return all gallery sections', async () => {
            const result: GallerySection[] = [
                {
                    id: '1',
                    weddingId: '123',
                    imageUrls: ['url1'],
                    metaData: '{}',
                    weddingDetail: null,
                },
            ];

            mockGallerySectionService.findAll.mockResolvedValue(result);

            expect(await controller.findAll()).toEqual(result);
            expect(mockGallerySectionService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a gallery section by id', async () => {
            const result: GallerySection = {
                id: '1',
                weddingId: '123',
                imageUrls: ['url1'],
                metaData: '{}',
                weddingDetail: null,
            };

            mockGallerySectionService.findOne.mockResolvedValue(result);

            expect(await controller.findOne('1')).toEqual(result);
            expect(mockGallerySectionService.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a gallery section by id', async () => {
            const updateDto: UpdateGallerySectionDto = {
                imageUrls: ['url1', 'url2'],
            };

            const result: GallerySection = {
                id: '1',
                weddingId: '123',
                imageUrls: ['url1', 'url2'],
                metaData: '{}',
                weddingDetail: null,
            };

            mockGallerySectionService.update.mockResolvedValue(result);

            expect(await controller.update('1', updateDto)).toEqual(result);
            expect(mockGallerySectionService.update).toHaveBeenCalledWith(
                '1',
                updateDto,
            );
        });
    });

    describe('remove', () => {
        it('should remove a gallery section by id', async () => {
            mockGallerySectionService.remove.mockResolvedValue(undefined);

            expect(await controller.remove('1')).toBeUndefined();
            expect(mockGallerySectionService.remove).toHaveBeenCalledWith('1');
        });
    });
});
