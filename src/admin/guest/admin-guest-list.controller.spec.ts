import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuestListController } from './guest.controller';
import { GuestListService } from 'src/models/guest/guest.service';
import { CreateGuestListDto } from 'src/models/guest/dto/create-guest.dto';
import { UpdateGuestListDto } from 'src/models/guest/dto/update-guest.dto';
import { GuestList, GuestStatus } from 'src/models/guest/entity/guest.entity';

describe('AdminGuestListController', () => {
    let controller: AdminGuestListController;
    let service: GuestListService;

    const mockGuestListService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminGuestListController],
            providers: [
                {
                    provide: GuestListService,
                    useValue: mockGuestListService,
                },
            ],
        }).compile();

        controller = module.get<AdminGuestListController>(AdminGuestListController);
        service = module.get<GuestListService>(GuestListService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new guest list entry', async () => {
            const createDto: CreateGuestListDto = {
                weddingId: '123',
                name: 'John Doe',
                relationship: 'Friend',
                status: GuestStatus.INVITED,
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',
                tableNumber: 5,
            };

            const result: GuestList = {
                id: '1',
                weddingId: '123',
                name: 'John Doe',
                relationship: 'Friend',
                status: GuestStatus.INVITED,
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',
                tableNumber: 5,
                weddingDetail: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockGuestListService.create.mockResolvedValue(result);

            expect(await controller.create(createDto)).toEqual(result);
            expect(mockGuestListService.create).toHaveBeenCalledWith(createDto);
        });

        it('should return an error if required fields are missing', async () => {
            const createDto: CreateGuestListDto = {
                weddingId: '',  // Wedding ID should not be empty
                name: '',  // Name should not be empty
                relationship: '',  // Relationship should not be empty
                status: GuestStatus.INVITED,
                email: '',  // Email must be provided
                phone: '',  // Phone must be provided
                note: '',  // Note must be provided
                tableNumber: 0,  // Table number should not be zero or undefined
            };

            mockGuestListService.create.mockRejectedValue(new Error('Missing required fields'));

            await expect(controller.create(createDto)).rejects.toThrow('Missing required fields');
        });
    });

    describe('findAll', () => {
        it('should return all guest list entries', async () => {
            const result: GuestList[] = [
                {
                    id: '1',
                    weddingId: '123',
                    name: 'John Doe',
                    relationship: 'Friend',
                    status: GuestStatus.INVITED,
                    weddingDetail: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                    note: 'Looking forward to the wedding!',
                    tableNumber: 5,
                },
            ];

            mockGuestListService.findAll.mockResolvedValue({
                guests: result,
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

            expect(await controller.findAll('123', 1, 10)).toEqual({
                guests: result,
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            });
            expect(mockGuestListService.findAll).toHaveBeenCalledWith('123', 1, 10);
        });
    });

    describe('findOne', () => {
        it('should return a guest list entry by ID', async () => {
            const result: GuestList = {
                id: '1',
                weddingId: '123',
                name: 'John Doe',
                relationship: 'Friend',
                status: GuestStatus.INVITED,
                weddingDetail: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',
                tableNumber: 5,
            };

            mockGuestListService.findOne.mockResolvedValue(result);

            expect(await controller.findOne('1')).toEqual(result);
            expect(mockGuestListService.findOne).toHaveBeenCalledWith('1');
        });

        it('should return 404 if guest list entry not found', async () => {
            mockGuestListService.findOne.mockResolvedValue(null);

            await expect(controller.findOne('nonexistent-id')).rejects.toThrowError('Not Found');
        });
    });

    describe('update', () => {
        it('should update a guest list entry by ID', async () => {
            const updateDto: UpdateGuestListDto = {
                name: 'Jane Doe',
                status: GuestStatus.CONFIRMED,
            };

            const result: GuestList = {
                id: '1',
                weddingId: '123',
                name: 'Jane Doe',
                relationship: 'Friend',
                status: GuestStatus.CONFIRMED,
                weddingDetail: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                email: 'jane.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',
                tableNumber: 5,
            };

            mockGuestListService.update.mockResolvedValue(result);

            expect(await controller.update('1', updateDto)).toEqual(result);
            expect(mockGuestListService.update).toHaveBeenCalledWith('1', updateDto);
        });

        it('should return 404 if guest list entry not found', async () => {
            const updateDto: UpdateGuestListDto = {
                name: 'Jane Doe',
            };

            mockGuestListService.update.mockResolvedValue(null);

            await expect(controller.update('nonexistent-id', updateDto)).rejects.toThrowError('Not Found');
        });
    });

    describe('remove', () => {
        it('should remove a guest list entry by ID', async () => {
            const guest: GuestList = {
                id: '1',
                weddingId: '123',
                name: 'John Doe',
                relationship: 'Friend',
                status: GuestStatus.INVITED,
                weddingDetail: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',
                tableNumber: 5,
            };

            mockGuestListService.remove.mockResolvedValue(guest);

            await expect(controller.remove('1')).resolves.toBeUndefined();
            expect(mockGuestListService.remove).toHaveBeenCalledWith('1');
        });

        it('should return 404 if guest list entry not found for deletion', async () => {
            mockGuestListService.remove.mockResolvedValue(null);

            await expect(controller.remove('nonexistent-id')).rejects.toThrowError('Not Found');
        });
    });
});
