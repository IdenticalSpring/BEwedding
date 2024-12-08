import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuestbookSectionController } from './guestbook-section.controller';
import { GuestbookSectionService } from 'src/models/guestbook-section/guestbook-section.service';
import { CreateGuestbookSectionDto } from 'src/models/guestbook-section/dto/create-guestbook-section.dto';
import { UpdateGuestbookSectionDto } from 'src/models/guestbook-section/dto/update-guestbook-section.dto';
import { GuestbookSection } from 'src/models/guestbook-section/entity/guestbook-section.entity';

describe('AdminGuestbookSectionController', () => {
    let controller: AdminGuestbookSectionController;
    let service: GuestbookSectionService;

    const mockGuestbookSectionService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminGuestbookSectionController],
            providers: [
                {
                    provide: GuestbookSectionService,
                    useValue: mockGuestbookSectionService,
                },
            ],
        }).compile();

        controller = module.get<AdminGuestbookSectionController>(AdminGuestbookSectionController);
        service = module.get<GuestbookSectionService>(GuestbookSectionService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new guestbook section', async () => {
            const createDto: CreateGuestbookSectionDto = {
                weddingId: '123',
                guestName: 'John Doe',
                message: 'Congratulations!',
                metaData: 'Some meta data',
            };

            const result: GuestbookSection = {
                id: '1',
                weddingId: '123',
                guestName: 'John Doe',
                message: 'Congratulations!',
                metaData: 'Some meta data',
                weddingDetail: null,
            };

            mockGuestbookSectionService.create.mockResolvedValue(result);

            expect(await controller.create(createDto)).toEqual(result);
            expect(mockGuestbookSectionService.create).toHaveBeenCalledWith(createDto);
        });

        it('should return an error if wedding detail not found', async () => {
            const createDto: CreateGuestbookSectionDto = {
                weddingId: '123',
                guestName: 'John Doe',
                message: 'Congratulations!',
                metaData: 'Some meta data',
            };

            mockGuestbookSectionService.create.mockRejectedValue(new Error('Wedding details not found'));

            await expect(controller.create(createDto)).rejects.toThrow('Wedding details not found');
        });
    });

    describe('findAll', () => {
        it('should return all guestbook sections', async () => {
            const result: GuestbookSection[] = [
                {
                    id: '1',
                    weddingId: '123',
                    guestName: 'John Doe',
                    message: 'Congratulations!',
                    metaData: 'Some meta data',
                    weddingDetail: null,
                },
            ];

            mockGuestbookSectionService.findAll.mockResolvedValue(result);

            expect(await controller.findAll()).toEqual(result);
            expect(mockGuestbookSectionService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a guestbook section by ID', async () => {
            const result: GuestbookSection = {
                id: '1',
                weddingId: '123',
                guestName: 'John Doe',
                message: 'Congratulations!',
                metaData: 'Some meta data',
                weddingDetail: null,
            };

            mockGuestbookSectionService.findOne.mockResolvedValue(result);

            expect(await controller.findOne('1')).toEqual(result);
            expect(mockGuestbookSectionService.findOne).toHaveBeenCalledWith('1');
        });

        it('should return 404 if guestbook section not found', async () => {
            mockGuestbookSectionService.findOne.mockResolvedValue(null);

            await expect(controller.findOne('nonexistent-id')).rejects.toThrowError('Guestbook section not found');
        });
    });

    describe('update', () => {
        it('should update a guestbook section by ID', async () => {
            const updateDto: UpdateGuestbookSectionDto = {
                guestName: 'Jane Doe',
                message: 'Best wishes!',
            };

            const result: GuestbookSection = {
                id: '1',
                weddingId: '123',
                guestName: 'Jane Doe',
                message: 'Best wishes!',
                metaData: 'Some meta data',
                weddingDetail: null,
            };

            mockGuestbookSectionService.update.mockResolvedValue(result);

            expect(await controller.update('1', updateDto)).toEqual(result);
            expect(mockGuestbookSectionService.update).toHaveBeenCalledWith('1', updateDto);
        });

        it('should return 404 if guestbook section not found', async () => {
            const updateDto: UpdateGuestbookSectionDto = {
                guestName: 'Jane Doe',
                message: 'Best wishes!',
            };

            mockGuestbookSectionService.update.mockResolvedValue(null);

            await expect(controller.update('nonexistent-id', updateDto)).rejects.toThrowError('Guestbook section not found');
        });
    });

    it('should remove a guestbook section by ID', async () => {
        const guestbookSection: GuestbookSection = {
            id: '1',
            weddingId: '123',
            guestName: 'John Doe',
            message: 'Congratulations!',
            metaData: 'Some meta data',
            weddingDetail: null,
        };

        mockGuestbookSectionService.remove.mockResolvedValue(guestbookSection);

        await expect(controller.remove('1')).resolves.toEqual(guestbookSection);
        expect(mockGuestbookSectionService.remove).toHaveBeenCalledWith('1');
    });

});
