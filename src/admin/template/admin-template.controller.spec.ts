import { Test, TestingModule } from '@nestjs/testing';
import { AdminTemplateController } from './template.controller';
import { TemplateService } from 'src/models/template/template.service';
import { CloudinaryService } from 'src/models/cloudinary/cloudinary.service';
import { CreateTemplateDto } from 'src/models/template/dto/create-template.dto';
import { UpdateTemplateDto } from 'src/models/template/dto/update-template.dto';
import { Template } from 'src/models/template/entity/template.entity';
import { NotFoundException } from '@nestjs/common';

describe('AdminTemplateController', () => {
  let controller: AdminTemplateController;
  let templateService: TemplateService;
  let cloudinaryService: CloudinaryService;

  const mockTemplateService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminTemplateController],
      providers: [
        {
          provide: TemplateService,
          useValue: mockTemplateService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    controller = module.get<AdminTemplateController>(AdminTemplateController);
    templateService = module.get<TemplateService>(TemplateService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new template', async () => {
      const createDto: CreateTemplateDto = {
        name: 'Landing Page Template',
        description: 'A modern landing page template with responsive design.',
        metaData: 'Some metadata',
        accessType: 'FREE',
      };

      const file: Express.Multer.File = {
        fieldname: 'thumbnail',
        originalname: 'thumbnail.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('image-data'),
        size: 12345,
      } as any; // Mocked file

      const result: Template = {
        id: '1',
        ...createDto,
        thumbnailUrl: 'http://example.com/thumbnail.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        theme: [],
        sections: [],
      };

      // Mock the cloudinary upload method
      mockCloudinaryService.uploadImage.mockResolvedValue({
        secure_url: 'http://example.com/thumbnail.png',
      });

      // Mock templateService create method
      mockTemplateService.create.mockResolvedValue(result);

      await controller.create(createDto, file); // Pass the mock file here

      // Ensure uploadImage was called
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(file);

      // Ensure the template creation was called with the correct data
      expect(mockTemplateService.create).toHaveBeenCalledWith(createDto);

      // Check the final result
      expect(await controller.create(createDto, file)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a template by ID', async () => {
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Template',
        description: 'Updated description',
      };

      const file: Express.Multer.File = {
        fieldname: 'thumbnail',
        originalname: 'updated-thumbnail.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('image-data'),
        size: 12345,
      } as any; // Mocked file

      const result: Template = {
        id: '1',
        name: 'Updated Template',
        description: 'Updated description',
        accessType: 'FREE',
        thumbnailUrl: 'http://example.com/updated-thumbnail.png',
        metaData: 'Updated metadata',
        createdAt: new Date(),
        updatedAt: new Date(),
        theme: [],
        sections: [],
      };

      // Mock the cloudinary upload method
      mockCloudinaryService.uploadImage.mockResolvedValue({
        secure_url: 'http://example.com/updated-thumbnail.png',
      });

      // Mock templateService update method
      mockTemplateService.update.mockResolvedValue(result);

      await controller.update('1', updateDto, file); // Pass the mock file here

      // Ensure uploadImage was called
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(file);

      // Ensure the template update was called with the correct data
      expect(mockTemplateService.update).toHaveBeenCalledWith('1', updateDto);

      // Check the final result
      expect(await controller.update('1', updateDto, file)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return a list of templates', async () => {
      const result = {
        data: [
          {
            id: '1',
            name: 'Template 1',
            description: 'Description 1',
            accessType: 'FREE',
          },
          {
            id: '2',
            name: 'Template 2',
            description: 'Description 2',
            accessType: 'VIP',
          },
        ],
        total: 2,
        page: 1,
        limit: 12,
      };

      mockTemplateService.findAll.mockResolvedValue(result);

      expect(await controller.findAll('1', '12')).toEqual(result);
      expect(mockTemplateService.findAll).toHaveBeenCalledWith(1, 12);
    });
  });

  describe('findOne', () => {
    it('should return a template by ID', async () => {
      const result: Template = {
        id: '1',
        name: 'Template 1',
        description: 'Description 1',
        accessType: 'FREE',
        thumbnailUrl: 'http://example.com/thumbnail.png',
        metaData: 'Some metadata',
        createdAt: new Date(),
        updatedAt: new Date(),
        theme: [],
        sections: [],
      };

      mockTemplateService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockTemplateService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw 404 if template not found', async () => {
      mockTemplateService.findOne.mockRejectedValue(
        new NotFoundException('Template with ID "999" not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrowError(
        new NotFoundException('Template with ID "999" not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a template by ID', async () => {
      mockTemplateService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(mockTemplateService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw 404 if template to remove not found', async () => {
      mockTemplateService.remove.mockRejectedValue(
        new NotFoundException('Template with ID "999" not found'),
      );

      await expect(controller.remove('999')).rejects.toThrowError(
        new NotFoundException('Template with ID "999" not found'),
      );
    });
  });
});
