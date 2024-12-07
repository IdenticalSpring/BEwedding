import { Test, TestingModule } from '@nestjs/testing';
import { AdminAboutSectionController } from './about-section.controller';
import { AboutSectionService } from 'src/models/about-section/about-section.service';
import { WeddingDetailService } from 'src/models/wedding-details/wedding-details.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { CreateAboutSectionDto } from 'src/models/about-section/dto/create-about-section.dto';
import { UpdateAboutSectionDto } from 'src/models/about-section/dto/update-about-section.dto';
import { AboutSection } from 'src/models/about-section/entity/about-section.entity';
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity';

describe('AdminAboutSectionController', () => {
    let app: INestApplication;
    let aboutSectionService: AboutSectionService;
    let weddingDetailService: WeddingDetailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminAboutSectionController],
            providers: [
                {
                    provide: AboutSectionService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: WeddingDetailService,
                    useValue: {
                        findOne: jest.fn(), // Sửa thành findOne vì trong controller đang gọi findOne
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        aboutSectionService = module.get<AboutSectionService>(AboutSectionService);
        weddingDetailService = module.get<WeddingDetailService>(WeddingDetailService);
    });

    it('should be defined', () => {
        const controller = app.get<AdminAboutSectionController>(AdminAboutSectionController);
        expect(controller).toBeDefined();
    });



    it('should return 200 if about section is found for GET /admin/about-sections/:id', async () => {
        const mockId = 'existing-id';
        const mockWeddingDetail: WeddingDetail = {
            id: 'existing-wedding-id',
            brideName: 'Bride Name',
            groomName: 'Groom Name',
            eventDate: new Date(),
            location: 'Location',
            bankAccount: 'BankAccount',
            cryptoWallet: 'CryptoWallet',
            metaData: 'Wedding metadata',
            createdAt: new Date(),
            updatedAt: new Date(),
            headerSections: [],
            aboutSections: [],
            eventDetails: [],
            gallerySection: [],
            guestbookSections: [],
            guestLists: [],
            template: null,
        };

        const mockAboutSection = {
            id: 'existing-id',
            weddingDetail: mockWeddingDetail,
            brideBio: 'Bride Bio',
            groomBio: 'Groom Bio',
            imageUrls: ['image1.jpg', 'image2.jpg'],
            metaData: 'Meta Data',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        jest.spyOn(aboutSectionService, 'findOne').mockResolvedValue(mockAboutSection);

        return request(app.getHttpServer())
            .get(`/admin/about-sections/${mockId}`)
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.id).toBe(mockAboutSection.id);
                expect(res.body.weddingDetail.id).toBe(mockWeddingDetail.id);
            });
    });

    it('should return 201 if AboutSection is created successfully', async () => {
        const createDto: CreateAboutSectionDto = {
            weddingId: 'existing-wedding-id',
            brideBio: 'Cô dâu là người thông minh và xinh đẹp...',
            groomBio: 'Chú rể là người chân thành và nhiệt huyết...',
            imageUrls: ['https://example.com/bride.jpg', 'https://example.com/groom.jpg'],
            metaData: 'Some metadata',
        };

        // Mock WeddingDetail đã tồn tại
        const mockWeddingDetail: WeddingDetail = {
            id: 'existing-wedding-id',
            brideName: 'Bride Name',
            groomName: 'Groom Name',
            eventDate: new Date(),
            location: 'Location',
            bankAccount: 'BankAccount',
            cryptoWallet: 'CryptoWallet',
            metaData: 'Wedding metadata',
            createdAt: new Date(),
            updatedAt: new Date(),
            headerSections: [],
            aboutSections: [],
            eventDetails: [],
            gallerySection: [],
            guestbookSections: [],
            guestLists: [],
            template: null,
        };

        const mockCreatedAboutSection = {
            id: 'new-id',
            weddingDetail: mockWeddingDetail,
            brideBio: createDto.brideBio,
            groomBio: createDto.groomBio,
            imageUrls: createDto.imageUrls,
            metaData: createDto.metaData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        jest.spyOn(weddingDetailService, 'findOne').mockResolvedValue(mockWeddingDetail);
        jest.spyOn(aboutSectionService, 'create').mockResolvedValue(mockCreatedAboutSection);

        return request(app.getHttpServer())
            .post('/admin/about-sections')
            .send(createDto)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
                expect(res.body.id).toBeDefined();
                expect(res.body.weddingDetail.id).toBe(mockWeddingDetail.id);
            });
    });

    it('should return 400 if update AboutSection fails', async () => {
        const updateDto: UpdateAboutSectionDto = {
            brideBio: 'Updated bio',
            groomBio: 'Updated bio',
            imageUrls: ['https://example.com/updated.jpg'],
            metaData: 'Updated data',
        };

        const nonExistingSectionId = 'non-existing-id';
        jest.spyOn(aboutSectionService, 'update').mockRejectedValue(new Error('About section not found'));

        return request(app.getHttpServer())
            .patch(`/admin/about-sections/${nonExistingSectionId}`)
            .send(updateDto)
            .expect(400)
    });

    it('should return 200 if AboutSection is deleted successfully', async () => {
        const mockId = '1';
        jest.spyOn(aboutSectionService, 'remove').mockResolvedValue(undefined);

        return request(app.getHttpServer())
            .delete(`/admin/about-sections/${mockId}`)
            .expect(HttpStatus.OK);
    });

    afterAll(async () => {
        await app.close();
    });
});
