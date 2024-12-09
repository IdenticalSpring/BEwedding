import { Test, TestingModule } from '@nestjs/testing';
import { AdminEventDetailController } from './event-details.controller'; 
import { EventDetailService } from 'src/models/event-details/event-details.service';
import { CreateEventDetailDTO } from 'src/models/event-details/dto/create-event-details.dto';
import { UpdateEventDetailDTO } from 'src/models/event-details/dto/update-event-details.dto';
import { EventDetail } from 'src/models/event-details/entity/event-details.entity';

describe('AdminEventDetailController', () => {
    let controller: AdminEventDetailController;
    let service: EventDetailService;

    const mockEventDetailService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByWeddingID: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminEventDetailController],
            providers: [
                {
                    provide: EventDetailService,
                    useValue: mockEventDetailService,
                },
            ],
        }).compile();

        controller = module.get<AdminEventDetailController>(
            AdminEventDetailController,
        );
        service = module.get<EventDetailService>(EventDetailService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event detail', async () => {
            const createDto: CreateEventDetailDTO = {
                weddingId: '123',
                eventName: 'Test Event',
                eventDate: new Date(),
                location: 'Test Location',
                description: 'Test Description',
                metaData: '{}',
            };

            const result: EventDetail = {
                id: '1',
                ...createDto,
                weddingDetail: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockEventDetailService.create.mockResolvedValue(result);

            expect(await controller.create(createDto)).toEqual(result);
            expect(mockEventDetailService.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('findAll', () => {
        it('should return all event details', async () => {
            const result: EventDetail[] = [
                {
                    id: '1',
                    weddingDetail: null,
                    eventName: 'Event 1',
                    eventDate: new Date(),
                    location: 'Location 1',
                    description: 'Description 1',
                    metaData: '{}',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockEventDetailService.findAll.mockResolvedValue(result);

            expect(await controller.findAll()).toEqual(result);
            expect(mockEventDetailService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return an event detail by id', async () => {
            const result: EventDetail = {
                id: '1',
                weddingDetail: null,
                eventName: 'Event 1',
                eventDate: new Date(),
                location: 'Location 1',
                description: 'Description 1',
                metaData: '{}',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockEventDetailService.findOne.mockResolvedValue(result);

            expect(await controller.findOne('1')).toEqual(result);
            expect(mockEventDetailService.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('findByWeddingID', () => {
        it('should return event details by wedding ID', async () => {
            const result: EventDetail[] = [
                {
                    id: '1',
                    weddingDetail: null,
                    eventName: 'Event 1',
                    eventDate: new Date(),
                    location: 'Location 1',
                    description: 'Description 1',
                    metaData: '{}',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockEventDetailService.findByWeddingID.mockResolvedValue(result);

            expect(await controller.findByWeddingID('123')).toEqual(result);
            expect(mockEventDetailService.findByWeddingID).toHaveBeenCalledWith('123');
        });
    });

    describe('update', () => {
        it('should update an event detail', async () => {
            const updateDto: UpdateEventDetailDTO = {
                eventName: 'Updated Event',
            };

            const result: EventDetail = {
                id: '1',
                weddingDetail: null,
                eventName: 'Updated Event',
                eventDate: new Date(),
                location: 'Location 1',
                description: 'Description 1',
                metaData: '{}',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockEventDetailService.update.mockResolvedValue(result);

            expect(await controller.update('1', updateDto)).toEqual(result);
            expect(mockEventDetailService.update).toHaveBeenCalledWith('1', updateDto);
        });
    });

    describe('remove', () => {
        it('should remove an event detail by id', async () => {
            mockEventDetailService.remove.mockResolvedValue(undefined);

            expect(await controller.remove('1')).toBeUndefined();
            expect(mockEventDetailService.remove).toHaveBeenCalledWith('1');
        });
    });
});
