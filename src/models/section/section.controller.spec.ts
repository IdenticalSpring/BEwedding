import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';

describe('SectionController', () => {
    let app: INestApplication;
    let sectionService: SectionService;

    const mockSectionService = {
        findAll: jest.fn().mockResolvedValue([
            { id: 1, name: 'Section 1' },
            { id: 2, name: 'Section 2' },
        ]),
        findOne: jest.fn((id: string) =>
            Promise.resolve({ id: parseInt(id, 10), name: `Section ${id}` }),
        ),

    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [SectionController],
            providers: [{ provide: SectionService, useValue: mockSectionService }],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    // Test for GET /sections
    describe('GET /sections', () => {
        it('should return all sections', async () => {
            const response = await request(app.getHttpServer())
                .get('/sections')
                .expect(200);

            expect(response.body).toEqual([
                { id: 1, name: 'Section 1' },
                { id: 2, name: 'Section 2' },
            ]);
            expect(mockSectionService.findAll).toHaveBeenCalled();
        });

        it('should return an empty array if no sections exist', async () => {
            mockSectionService.findAll.mockResolvedValueOnce([]);
            const response = await request(app.getHttpServer())
                .get('/sections')
                .expect(200);

            expect(response.body).toEqual([]);
            expect(mockSectionService.findAll).toHaveBeenCalled();
        });
    });

    // Test for GET /sections/:id
    describe('GET /sections/:id', () => {
        it('should return a section by ID', async () => {
            const response = await request(app.getHttpServer())
                .get('/sections/1')
                .expect(200);

            expect(response.body).toEqual({ id: 1, name: 'Section 1' });
            expect(mockSectionService.findOne).toHaveBeenCalledWith(1);
        });

        it('should return 404 if section is not found', async () => {
            mockSectionService.findOne.mockRejectedValueOnce(new NotFoundException('Section not found'));

            const response = await request(app.getHttpServer())
                .get('/sections/999')
                .expect(404);

            expect(response.body.message).toEqual('Section not found');
            expect(mockSectionService.findOne).toHaveBeenCalledWith(999);
        });


        it('should return 400 if ID is invalid', async () => {
            const response = await request(app.getHttpServer())
                .get('/sections/invalid-id')
                .expect(400);

            expect(response.body.message).toContain('Validation failed');
        });
    });
});
