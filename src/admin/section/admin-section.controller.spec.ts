import { Test, TestingModule } from '@nestjs/testing';
import { AdminSectionController } from './section.controller'; 
import { SectionService } from 'src/models/section/section.service';
import { CreateSectionDto } from 'src/models/section/dto/create-section.dto';
import { UpdateSectionDto } from 'src/models/section/dto/update-section.dto';
import { Section } from 'src/models/section/entity/section.entity';
import { NotFoundException } from '@nestjs/common';
describe('AdminSectionController', () => {
    let controller: AdminSectionController;
    let service: SectionService;

    const mockSectionService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminSectionController],
            providers: [
                {
                    provide: SectionService,
                    useValue: mockSectionService,
                },
            ],
        }).compile();

        controller = module.get<AdminSectionController>(AdminSectionController);
        service = module.get<SectionService>(SectionService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new section', async () => {
            const createDto: CreateSectionDto = {
                name: 'Section 1',
                details: 'Section details',
                theme: 'light',
                templateId: 'template-id',
            };

            const result: Section = {
                id: 1,
                name: 'Section 1',
                details: 'Section details',
                theme: 'light',
                templateId: 'template-id',
                template: null,
                position: 'top',
                metadata: {},
            };

            mockSectionService.create.mockResolvedValue(result);

            expect(await controller.create(createDto)).toEqual(result);
            expect(mockSectionService.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('findOne', () => {
        it('should return a section by ID', async () => {
            const result: Section = {
                id: 1,
                name: 'Section 1',
                details: 'Section details',
                theme: 'light',
                templateId: 'template-id',
                template: null,
                position: 'top',
                metadata: {},
            };

            mockSectionService.findOne.mockResolvedValue(result);

            expect(await controller.findOne(1)).toEqual(result);
            expect(mockSectionService.findOne).toHaveBeenCalledWith(1);
        });

        it('should throw a 404 error if section not found', async () => {
            // Change from mockResolvedValue(null) to mockRejectedValue
            mockSectionService.findOne.mockRejectedValue(
                new NotFoundException('Section with ID 999 not found')
            );

            await expect(controller.findOne(999)).rejects.toThrowError(
                new NotFoundException('Section with ID 999 not found')
            );
        });
    });

    describe('update', () => {
        it('should update a section by ID', async () => {
            const updateDto: UpdateSectionDto = {
                name: 'Updated Section',
            };

            const result: Section = {
                id: 1,
                name: 'Updated Section',
                details: 'Section details',
                theme: 'light',
                templateId: 'template-id',
                template: null,
                position: 'top',
                metadata: {},
            };

            mockSectionService.update.mockResolvedValue(result);

            expect(await controller.update(1, updateDto)).toEqual(result);
            expect(mockSectionService.update).toHaveBeenCalledWith(1, updateDto);
        });

        it('should throw a 404 error if section to update not found', async () => {
            const updateDto: UpdateSectionDto = { name: 'Updated Section' };

            // Change from mockResolvedValue(null) to mockRejectedValue
            mockSectionService.update.mockRejectedValue(
                new NotFoundException('Section with ID 999 not found')
            );

            await expect(controller.update(999, updateDto)).rejects.toThrowError(
                new NotFoundException('Section with ID 999 not found')
            );
        });
    });

    describe('remove', () => {
        it('should remove a section by ID', async () => {
            mockSectionService.remove.mockResolvedValue(undefined);

            await expect(controller.remove(1)).resolves.toBeUndefined();
            expect(mockSectionService.remove).toHaveBeenCalledWith(1);
        });

        it('should throw a 404 error if section to remove not found', async () => {
            // Change from mockResolvedValue(null) to mockRejectedValue
            mockSectionService.remove.mockRejectedValue(
                new NotFoundException('Section with ID 999 not found')
            );

            await expect(controller.remove(999)).rejects.toThrowError(
                new NotFoundException('Section with ID 999 not found')
            );
        });
    });
});

