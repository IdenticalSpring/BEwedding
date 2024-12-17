import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; 
import request from 'supertest';

describe('TemplateController', () => {
  let app: INestApplication;
  let templateService: TemplateService;

  const mockTemplateService = {
    findAll: jest.fn().mockResolvedValue([
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' },
    ]),
    findOne: jest.fn().mockImplementation((id: string) =>
      Promise.resolve({ id: parseInt(id, 10), name: `Template ${id}` }),
    ),
  };
    const mockCloudinaryService = {
        uploadFile: jest.fn(), 
    };
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        { provide: TemplateService, useValue: mockTemplateService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    templateService = moduleFixture.get<TemplateService>(TemplateService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get all templates', async () => {
    const response = await request(app.getHttpServer())
      .get('/templates')
      .expect(200);

    expect(response.body).toEqual([
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' },
    ]);
    expect(templateService.findAll).toHaveBeenCalledWith(1, 12);
  });

  it('should get all templates with pagination', async () => {
    const response = await request(app.getHttpServer())
      .get('/templates?page=2&limit=5')
      .expect(200);

    expect(response.body).toEqual([
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' },
    ]);
    expect(templateService.findAll).toHaveBeenCalledWith(2, 5);
  });

  it('should get template by ID', async () => {
    const response = await request(app.getHttpServer())
      .get('/templates/1')
      .expect(200);

    expect(response.body).toEqual({ id: 1, name: 'Template 1' });
    expect(templateService.findOne).toHaveBeenCalledWith('1');
  });

  it('should return 404 if template not found', async () => {
    jest.spyOn(templateService, 'findOne').mockImplementation((id: string) => {
      if (id === '999271635412745') {
        return Promise.resolve(null);
      }
      return Promise.resolve({ id: parseInt(id, 10), name: `Template ${id}` });
    });
    const response = await request(app.getHttpServer())
      .get('/templates/999271635412745')
      .expect(404);

    expect(response.body.message).toBe('Template not found');
  });
});