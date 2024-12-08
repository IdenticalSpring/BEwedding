import { Test, TestingModule } from '@nestjs/testing';
import { AdminWeddingDetailController } from './wedding-details.controller'; 
import { WeddingDetailService } from 'src/models/wedding-details/wedding-details.service';
import { NotFoundException } from '@nestjs/common';
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity';
import { CreateWeddingDetailDto } from 'src/models/wedding-details/dto/create-wedding-details.dto';
import { UpdateWeddingDetailDto } from 'src/models/wedding-details/dto/update-wedding-details.dto';

describe('AdminWeddingDetailController', () => {
    let controller: AdminWeddingDetailController;
    let service: WeddingDetailService;

    const mockWeddingDetail = {
        id: '1',
        brideName: 'Jane Doe',
        groomName: 'John Smith',
        eventDate: new Date(),
        location: 'Location A',
        metaData: 'Sample metadata',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockWeddingDetailService = {
        create: jest.fn().mockResolvedValue(mockWeddingDetail),
        findAll: jest.fn().mockResolvedValue([mockWeddingDetail]),
        findOne: jest.fn().mockResolvedValue(mockWeddingDetail),
        update: jest.fn().mockResolvedValue(mockWeddingDetail),
        remove: jest.fn().mockResolvedValue(mockWeddingDetail),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminWeddingDetailController],
            providers: [
                {
                    provide: WeddingDetailService,
                    useValue: mockWeddingDetailService,
                },
            ],
        }).compile();

        controller = module.get<AdminWeddingDetailController>(AdminWeddingDetailController);
        service = module.get<WeddingDetailService>(WeddingDetailService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a wedding detail', async () => {
        const createWeddingDetailDto: CreateWeddingDetailDto = {
            brideName: 'Jane Doe',
            groomName: 'John Smith',
            eventDate: new Date(),
            location: 'Location A',
            metaData: 'Sample metadata',
        };
        const result = await controller.create(createWeddingDetailDto);
        expect(result).toEqual(mockWeddingDetail);
        expect(service.create).toHaveBeenCalledWith(createWeddingDetailDto);
    });

    it('should return all wedding details', async () => {
        const result = await controller.findAll();
        expect(result).toEqual([mockWeddingDetail]);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should return wedding detail by ID', async () => {
        const result = await controller.findOne('1');
        expect(result).toEqual(mockWeddingDetail);
        expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw an error if wedding detail not found', async () => {
        jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
        await expect(controller.findOne('1')).rejects.toThrowError(NotFoundException);
    });

    it('should update a wedding detail', async () => {
        const updateWeddingDetailDto: UpdateWeddingDetailDto = {
            brideName: 'Updated Jane Doe',
            groomName: 'Updated John Smith',
            eventDate: new Date(),
            location: 'Updated Location A',
            metaData: 'Updated metadata',
        };
        const result = await controller.update('1', updateWeddingDetailDto);
        expect(result).toEqual(mockWeddingDetail);
        expect(service.update).toHaveBeenCalledWith('1', updateWeddingDetailDto);
    });

    it('should remove a wedding detail', async () => {
        const result = await controller.remove('1');
        expect(result).toEqual(mockWeddingDetail);
        expect(service.remove).toHaveBeenCalledWith('1');
    });
});
