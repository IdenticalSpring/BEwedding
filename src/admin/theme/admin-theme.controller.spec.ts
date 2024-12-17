import { Test, TestingModule } from '@nestjs/testing';
import { AdminThemeController } from './theme.controller';
import { ThemeService } from 'src/models/theme/theme.service';
import { CreateThemeDto } from 'src/models/theme/dto/create-theme.dto';
import { UpdateThemeDto } from 'src/models/theme/dto/update-theme.dto';
import { Theme } from 'src/models/theme/entity/theme.entity';
import { Template } from 'src/models/template/entity/template.entity';
import { User } from 'src/models/user/entity/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('AdminThemeController', () => {
    let controller: AdminThemeController;
    let mockThemeService: any;

    beforeEach(async () => {
        mockThemeService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminThemeController],
            providers: [
                {
                    provide: ThemeService,
                    useValue: mockThemeService,
                },
            ],
        }).compile();

        controller = module.get<AdminThemeController>(AdminThemeController);
    });

    describe('create', () => {
        it('should create a new theme', async () => {
            const createDto: CreateThemeDto = {
                templateId: 'existing-template-id',
                themeName: 'Dark Theme',
                primaryColor: '#000000',
                secondaryColor: '#FFFFFF',
                metaData: 'Some metadata',
            };

            const mockTemplate: Template = {
                id: 'existing-template-id',
                name: 'Sample Template',
                thumbnailUrl: 'thumbnail.jpg',
                description: 'Sample template description',
                accessType: 'FREE',
                metaData: 'Some metadata',
                createdAt: new Date(),
                updatedAt: new Date(),
                theme: [],
                sections: [],
            };

            const result: Theme = {
                id: 'new-theme-id',
                themeName: createDto.themeName,
                primaryColor: createDto.primaryColor,
                secondaryColor: createDto.secondaryColor,
                metaData: createDto.metaData,
                template: mockTemplate, // Correctly assign Template
                templateId: 'existing-template-id',
            };

            // Mock ThemeService.create to return the result
            mockThemeService.create.mockResolvedValue(result);

            // Call controller.create
            const createdTheme = await controller.create(createDto);

            // Check that ThemeService.create was called correctly
            expect(mockThemeService.create).toHaveBeenCalledTimes(1);
            expect(mockThemeService.create).toHaveBeenCalledWith(createDto);

            // Check the result
            expect(createdTheme).toEqual(result);
        });
    });

    describe('findAll', () => {
        it('should return a list of themes', async () => {
            const result = {
                data: [
                    { id: '1', themeName: 'Dark Theme', primaryColor: '#000000', secondaryColor: '#FFFFFF', metaData: 'Some metadata' },
                    { id: '2', themeName: 'Light Theme', primaryColor: '#FFFFFF', secondaryColor: '#000000', metaData: 'Some metadata' },
                ],
                total: 2,
                page: 1,
                limit: 10,
                totalPages: 1,
            };

            // Mock ThemeService.findAll to return the result
            mockThemeService.findAll.mockResolvedValue(result);

            const page = 1;
            const limit = 10;
            const themes = await controller.findAll(page, limit);

            // Check that ThemeService.findAll was called correctly
            expect(mockThemeService.findAll).toHaveBeenCalledWith(page, limit);

            // Check the result
            expect(themes).toEqual(result);
        });
    });

    describe('update', () => {
        it('should update an existing theme', async () => {
            const updateDto: UpdateThemeDto = {
                themeName: 'Updated Dark Theme',
                primaryColor: '#111111',
                secondaryColor: '#FFFFFF',
            };

            const mockTemplate: Template = {
                id: 'existing-template-id',
                name: 'Sample Template',
                thumbnailUrl: 'thumbnail.jpg',
                description: 'Sample template description',
                accessType: 'FREE',
                metaData: 'Some metadata',
                createdAt: new Date(),
                updatedAt: new Date(),
                theme: [],
                sections: [],
            };

            const updatedTheme: Theme = {
                id: '1',
                themeName: 'Updated Dark Theme',
                primaryColor: '#111111',
                secondaryColor: '#FFFFFF',
                metaData: 'Some metadata',
                template: mockTemplate, // Correctly assign Template
                templateId: 'existing-template-id',
            };

            // Mock ThemeService.update to return the updated theme
            mockThemeService.update.mockResolvedValue(updatedTheme);

            // Call controller.update
            const result = await controller.update('1', updateDto);

            // Check that ThemeService.update was called correctly
            expect(mockThemeService.update).toHaveBeenCalledWith('1', updateDto);

            // Check the result
            expect(result).toEqual(updatedTheme);
        });

        it('should throw an error if theme not found', async () => {
            const updateDto: UpdateThemeDto = {
                themeName: 'Updated Dark Theme',
                primaryColor: '#111111',
                secondaryColor: '#FFFFFF',
            };

            // Mock ThemeService.update to throw NotFoundException when theme is not found
            mockThemeService.update.mockRejectedValue(new NotFoundException('Theme not found'));

            // Call controller.update and expect it to throw
            await expect(controller.update('999', updateDto)).rejects.toThrowError('Theme not found');

            // Check that ThemeService.update was called correctly
            expect(mockThemeService.update).toHaveBeenCalledWith('999', updateDto);
        });
    });

    describe('remove', () => {
        it('should remove a theme by ID', async () => {
            // Mock ThemeService.remove to resolve successfully
            mockThemeService.remove.mockResolvedValue(undefined);

            // Call controller.remove
            await controller.remove('1');

            // Check that ThemeService.remove was called correctly
            expect(mockThemeService.remove).toHaveBeenCalledWith('1');
        });

        it('should throw an error if theme to remove not found', async () => {
            // Mock ThemeService.remove to throw NotFoundException when theme is not found
            mockThemeService.remove.mockRejectedValue(new NotFoundException('Theme not found'));

            // Call controller.remove and expect it to throw
            await expect(controller.remove('999')).rejects.toThrowError('Theme not found');

            // Check that ThemeService.remove was called correctly
            expect(mockThemeService.remove).toHaveBeenCalledWith('999');
        });
    });
});
