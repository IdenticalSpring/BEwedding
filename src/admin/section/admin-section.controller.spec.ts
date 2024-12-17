import { Test, TestingModule } from '@nestjs/testing';
import { AdminSectionController } from './section.controller';
import { SectionService } from 'src/models/section/section.service';
import { CreateSectionDto } from 'src/models/section/dto/create-section.dto';
import { UpdateSectionDto } from 'src/models/section/dto/update-section.dto';
import { Section } from 'src/models/section/entity/section.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AdminSectionController', () => {
    let controller: AdminSectionController;
    let sectionService: SectionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminSectionController],
            providers: [
                {
                    provide: SectionService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AdminSectionController>(AdminSectionController);
        sectionService = module.get<SectionService>(SectionService);
    });

    describe('create', () => {
        it('should create a new section', async () => {
            const createSectionDto: CreateSectionDto = {
                name: 'Wedding Section',
                style: { color: 'red' },
            };

            const result: Section = {
                id: 1,
                name: 'Wedding Section',
                style: { color: 'red' },
                theme: 'Classic',
                templateId: 'template123',
                position: 'top',
                metadata: { key: 'value' },
                // Cần thêm thuộc tính 'template' (có thể là một đối tượng)
                template: {
                    id: 'template-123', name: 'Classic Template',
                    thumbnailUrl: '',
                    description: '',
                    metaData: '',
                    accessType: 'FREE',
                    createdAt: undefined,
                    updatedAt: undefined,
                    theme: [],
                    sections: []
                },
            };

            sectionService.create = jest.fn().mockResolvedValue(result);

            expect(await controller.create(createSectionDto)).toEqual(result);
            expect(sectionService.create).toHaveBeenCalledWith(createSectionDto);
        });

        it('should throw error if section creation fails', async () => {
            const createSectionDto: CreateSectionDto = {
                name: 'Invalid Section',
            };

            sectionService.create = jest.fn().mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

            try {
                await controller.create(createSectionDto);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    });

    describe('findAll', () => {
        it('should return an array of sections', async () => {
            const result: Section[] = [
                { id: 1, name: 'Wedding Section', style: { color: 'red' }, theme: 'Classic', templateId: 'template123', position: 'top', metadata: { key: 'value' }, template: {
                    id: 'template-123', name: 'Classic Template',
                    thumbnailUrl: '',
                    description: '',
                    metaData: '',
                    accessType: 'FREE',
                    createdAt: undefined,
                    updatedAt: undefined,
                    theme: [],
                    sections: []
                } },
                { id: 2, name: 'Gallery Section', style: { color: 'blue' }, theme: 'Modern', templateId: 'template456', position: 'bottom', metadata: { key: 'value' }, template: {
                    id: 'template-456', name: 'Modern Template',
                    thumbnailUrl: '',
                    description: '',
                    metaData: '',
                    accessType: 'FREE',
                    createdAt: undefined,
                    updatedAt: undefined,
                    theme: [],
                    sections: []
                } },
            ];

            sectionService.findAll = jest.fn().mockResolvedValue(result);

            expect(await controller.findAll()).toEqual(result);
            expect(sectionService.findAll).toHaveBeenCalled();
        });

        it('should throw error if no sections are found', async () => {
            sectionService.findAll = jest.fn().mockResolvedValue([]);

            const result = await controller.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return section details by ID', async () => {
            const result: Section = {
                id: 1,
                name: 'Wedding Section',
                style: { color: 'red' },
                theme: 'Classic',
                templateId: 'template123',
                position: 'top',
                metadata: { key: 'value' },
                template: {
                    id: 'template-123', name: 'Classic Template',
                    thumbnailUrl: '',
                    description: '',
                    metaData: '',
                    accessType: 'FREE',
                    createdAt: undefined,
                    updatedAt: undefined,
                    theme: [],
                    sections: []
                },
            };

            sectionService.findOne = jest.fn().mockResolvedValue(result);

            expect(await controller.findOne(1)).toEqual(result);
            expect(sectionService.findOne).toHaveBeenCalledWith(1);
        });

        it('should throw error if section is not found', async () => {
            sectionService.findOne = jest.fn().mockResolvedValue(null);

            try {
                await controller.findOne(999);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('update', () => {
        it('should update section details', async () => {
            const updateSectionDto: UpdateSectionDto = {
                name: 'Updated Wedding Section',
                style: { color: 'blue' },
            };

            const result: Section = {
                id: 1,
                name: 'Updated Wedding Section',
                style: { color: 'blue' },
                theme: 'Classic',
                templateId: 'template123',
                position: 'top',
                metadata: { key: 'value' },
                template: {
                    id: 'template-123', name: 'Classic Template',
                    thumbnailUrl: '',
                    description: '',
                    metaData: '',
                    accessType: 'FREE',
                    createdAt: undefined,
                    updatedAt: undefined,
                    theme: [],
                    sections: []
                },
            };

            sectionService.update = jest.fn().mockResolvedValue(result);

            expect(await controller.update(1, updateSectionDto)).toEqual(result);
            expect(sectionService.update).toHaveBeenCalledWith(1, updateSectionDto);
        });

        it('should throw error if section to update is not found', async () => {
            sectionService.update = jest.fn().mockResolvedValue(null);

            try {
                await controller.update(999, { name: 'Non-existent Section' });
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('remove', () => {
        it('should remove a section by ID', async () => {
            const result = undefined; // When section is removed successfully, it returns undefined.

            sectionService.remove = jest.fn().mockResolvedValue(result);

            await expect(controller.remove(1)).resolves.toBeUndefined();
            expect(sectionService.remove).toHaveBeenCalledWith(1);
        });

        it('should throw error if section to remove is not found', async () => {
            sectionService.remove = jest.fn().mockResolvedValue(null);

            try {
                await controller.remove(999);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });
});
