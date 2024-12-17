import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SectionUserController } from './section-user.controller';
import { SectionUserService } from './section-user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

describe('SectionUserController', () => {
    let app: INestApplication;
    let sectionUserService: SectionUserService;

    const mockSectionUserService = {
        findAll: jest.fn().mockResolvedValue([
            { id: 1, name: 'Section 1' },
            { id: 2, name: 'Section 2' },
        ]),
        findOne: jest.fn().mockImplementation((id: string) =>
            Promise.resolve({ id: parseInt(id, 10), name: `Section ${id}` }),
        ),
        create: jest.fn().mockImplementation((dto) =>
            Promise.resolve({ id: 1, ...dto }),
        ),
        update: jest.fn().mockImplementation((id: string, dto) =>
            Promise.resolve({ id: parseInt(id, 10), ...dto }),
        ),
        remove: jest.fn().mockResolvedValue({}),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [SectionUserController],
            providers: [
                { provide: SectionUserService, useValue: mockSectionUserService },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        sectionUserService = moduleFixture.get<SectionUserService>(SectionUserService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('should get all sections', async () => {
        const response = await request(app.getHttpServer())
            .get('/section_user') // Sử dụng đúng đường dẫn
            .expect(200);

        expect(response.body).toEqual([
            { id: 1, name: 'Section 1' },
            { id: 2, name: 'Section 2' },
        ]);
        expect(sectionUserService.findAll).toHaveBeenCalled();
    });

    it('should get section by ID', async () => {
        const response = await request(app.getHttpServer())
            .get('/section_user/1') // Đúng đường dẫn
            .expect(200);

        expect(response.body).toEqual({ id: 1, name: 'Section 1' });
        expect(sectionUserService.findOne).toHaveBeenCalledWith('1');
    });

    it('should create a new section', async () => {
        const createDto = { name: 'New Section' };
        const response = await request(app.getHttpServer())
            .post('/section_user') // Đúng đường dẫn
            .send(createDto)
            .expect(201);

        expect(response.body).toEqual({ id: 1, ...createDto });
        expect(sectionUserService.create).toHaveBeenCalledWith(createDto);
    });

    it('should update a section', async () => {
        const updateDto = { name: 'Updated Section' };
        const response = await request(app.getHttpServer())
            .patch('/section_user/1') // Sửa từ PUT thành PATCH
            .send(updateDto)
            .expect(200);

        expect(response.body).toEqual({ id: 1, ...updateDto });
        expect(sectionUserService.update).toHaveBeenCalledWith("1", updateDto);
    });

    it('should delete a section', async () => {
        const response = await request(app.getHttpServer())
            .delete('/section_user/1') // Đúng đường dẫn
            .expect(200);

        expect(response.body).toEqual({});
        expect(sectionUserService.remove).toHaveBeenCalledWith("1"); 
    });
});
