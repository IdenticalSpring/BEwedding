import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuestListController } from './guest.controller';
import { GuestListService } from 'src/models/guest/guest.service';
import { CreateGuestListDto } from 'src/models/guest/dto/create-guest.dto';
import { UpdateGuestListDto } from 'src/models/guest/dto/update-guest.dto';
import { GuestList, GuestStatus } from 'src/models/guest/entity/guest.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { templateUser } from 'src/models/template-user/entity/template-user.entity';

describe('AdminGuestListController', () => {
    let controller: AdminGuestListController;
    let service: GuestListService;

    const mockGuestListService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminGuestListController],
            providers: [
                {
                    provide: GuestListService,
                    useValue: mockGuestListService,
                },
            ],
        }).compile();

        controller = module.get<AdminGuestListController>(AdminGuestListController);
        service = module.get<GuestListService>(GuestListService);
    });

    describe('create', () => {
        it('should create a new guest list entry', async () => {
            const createDto: CreateGuestListDto = {
                weddingId: '123',
                name: 'John Doe',
                relationship: 'Friend',
                status: GuestStatus.INVITED,
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',
            };

            const result: GuestList = {
                id: '1',
                weddingId: '123',
                name: 'John Doe',
                relationship: 'Friend',
                status: GuestStatus.INVITED,
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',

                // Cung cấp thông tin đầy đủ cho weddingDetail
                weddingDetail: {
                    id: 'wedding-1',
                    brideName: 'Jane Doe',
                    groomName: 'John Smith',
                    eventDate: new Date('2024-12-25'),
                    location: 'Venue Address',
                    bankAccount: '1234567890',
                    cryptoWallet: 'crypto_wallet_address',
                    metaData: 'Additional wedding metadata',

                    // Thêm các mối quan hệ cần thiết
                    headerSections: [],  // Array trống nếu không có dữ liệu
                    aboutSections: [],
                    eventDetails: [],
                    gallerySection: [],
                    guestbookSections: [],

                    // Thêm thông tin TemplateUser và GuestLists
                    templateUser: {
                        id: 'templateUser-1',
                        name: 'Template User',
                    } as templateUser,  // Chuyển kiểu đúng
                    guestLists: [],  // Array trống nếu không có khách mời nào

                    createdAt: new Date(),
                    updatedAt: new Date(),
                },

                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockGuestListService.create.mockResolvedValue(result);

            expect(await controller.create(createDto)).toEqual(result);
            expect(mockGuestListService.create).toHaveBeenCalledWith(createDto);
        });
    });


    describe('findAll', () => {
        it('should return all guest list entries', async () => {
            const result: GuestList = {
                id: '1',
                weddingId: '123',
                name: 'John Doe',
                relationship: 'Friend',
                status: GuestStatus.INVITED,
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',

                // Cung cấp thông tin đầy đủ cho weddingDetail
                weddingDetail: {
                    id: 'wedding-1',
                    brideName: 'Jane Doe',
                    groomName: 'John Smith',
                    eventDate: new Date('2024-12-25'),
                    location: 'Venue Address',
                    bankAccount: '1234567890',
                    cryptoWallet: 'crypto_wallet_address',
                    metaData: 'Additional wedding metadata',

                    // Thêm các mối quan hệ cần thiết
                    headerSections: [],  // Array trống nếu không có dữ liệu
                    aboutSections: [],
                    eventDetails: [],
                    gallerySection: [],
                    guestbookSections: [],

                    // Thêm thông tin TemplateUser và GuestLists
                    templateUser: {
                        id: 'templateUser-1',
                        name: 'Template User',
                    } as templateUser,  // Chuyển kiểu đúng
                    guestLists: [],  // Array trống nếu không có khách mời nào

                    createdAt: new Date(),
                    updatedAt: new Date(),
                },

                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockGuestListService.findAll.mockResolvedValue({
                guests: result,
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

            expect(await controller.findAll('123', 1, 10)).toEqual({
                guests: result,
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            });
            expect(mockGuestListService.findAll).toHaveBeenCalledWith('123', 1, 10);
        });

        it('should return error if weddingId is not provided', async () => {
            mockGuestListService.findAll.mockResolvedValue([]);

            await expect(controller.findAll('', 1, 10)).rejects.toThrowError(
                'Wedding ID is required',
            );
        });
    });

    describe('findOne', () => {
        it('should return a guest list entry by ID', async () => {
            const result: GuestList = {
                id: '1',
                weddingId: '123',
                name: 'John Doe',
                relationship: 'Friend',
                status: GuestStatus.INVITED,
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',

                // Cung cấp thông tin đầy đủ cho weddingDetail
                weddingDetail: {
                    id: 'wedding-1',
                    brideName: 'Jane Doe',
                    groomName: 'John Smith',
                    eventDate: new Date('2024-12-25'),
                    location: 'Venue Address',
                    bankAccount: '1234567890',
                    cryptoWallet: 'crypto_wallet_address',
                    metaData: 'Additional wedding metadata',

                    // Thêm các mối quan hệ cần thiết
                    headerSections: [],  // Array trống nếu không có dữ liệu
                    aboutSections: [],
                    eventDetails: [],
                    gallerySection: [],
                    guestbookSections: [],

                    // Thêm thông tin TemplateUser và GuestLists
                    templateUser: {
                        id: 'templateUser-1',
                        name: 'Template User',
                    } as templateUser,  // Chuyển kiểu đúng
                    guestLists: [],  // Array trống nếu không có khách mời nào

                    createdAt: new Date(),
                    updatedAt: new Date(),
                },

                createdAt: new Date(),
                updatedAt: new Date(),
            };


            mockGuestListService.findOne.mockResolvedValue(result);

            expect(await controller.findOne('1')).toEqual(result);
            expect(mockGuestListService.findOne).toHaveBeenCalledWith('1');
        });

        it('should return 404 if guest list entry not found', async () => {
            mockGuestListService.findOne.mockResolvedValue(null);

            await expect(controller.findOne('nonexistent-id')).rejects.toThrowError(
                'Not Found',
            );
        });
    });

    describe('update', () => {
        it('should update a guest list entry by ID', async () => {
            const updateDto: UpdateGuestListDto = {
                name: 'Jane Doe',
                status: GuestStatus.CONFIRMED,
            };

            const result: GuestList = {
                id: '1',
                weddingId: '123',
                name: 'John Doe',
                relationship: 'Friend',
                status: GuestStatus.INVITED,
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',

                // Cung cấp thông tin đầy đủ cho weddingDetail
                weddingDetail: {
                    id: 'wedding-1',
                    brideName: 'Jane Doe',
                    groomName: 'John Smith',
                    eventDate: new Date('2024-12-25'),
                    location: 'Venue Address',
                    bankAccount: '1234567890',
                    cryptoWallet: 'crypto_wallet_address',
                    metaData: 'Additional wedding metadata',

                    // Thêm các mối quan hệ cần thiết
                    headerSections: [],  // Array trống nếu không có dữ liệu
                    aboutSections: [],
                    eventDetails: [],
                    gallerySection: [],
                    guestbookSections: [],

                    // Thêm thông tin TemplateUser và GuestLists
                    templateUser: {
                        id: 'templateUser-1',
                        name: 'Template User',
                    } as templateUser,  // Chuyển kiểu đúng
                    guestLists: [],  // Array trống nếu không có khách mời nào

                    createdAt: new Date(),
                    updatedAt: new Date(),
                },

                createdAt: new Date(),
                updatedAt: new Date(),
            };


            mockGuestListService.update.mockResolvedValue(result);

            expect(await controller.update('1', updateDto)).toEqual(result);
            expect(mockGuestListService.update).toHaveBeenCalledWith('1', updateDto);
        });

        it('should return 404 if guest list entry not found', async () => {
            const updateDto: UpdateGuestListDto = {
                name: 'Jane Doe',
            };

            mockGuestListService.update.mockResolvedValue(null);

            await expect(
                controller.update('nonexistent-id', updateDto),
            ).rejects.toThrowError('Not Found');
        });
    });

    describe('remove', () => {
        it('should remove a guest list entry by ID', async () => {
            // Giả sử mock dịch vụ remove với ID hợp lệ
            const mockGuest = {
                id: '1',
                name: 'John Doe',
                weddingId: '123',
                status: 'INVITED',
                email: 'john.doe@example.com',
                phone: '1234567890',
                note: 'Looking forward to the wedding!',
                weddingDetail: {
                    id: 'wedding-1',
                    brideName: 'Jane Doe',
                    groomName: 'John Smith',
                    eventDate: new Date('2024-12-25'),
                    location: 'Venue Address',
                    bankAccount: '1234567890',
                    cryptoWallet: 'crypto_wallet_address',
                    metaData: 'Additional wedding metadata',
                },
            };

            // Mô phỏng trường hợp tìm thấy khách mời và xóa thành công
            mockGuestListService.remove.mockResolvedValue(mockGuest);

            // Kiểm tra hành vi xóa thành công
            await expect(controller.remove('1')).resolves.toBeUndefined();
            expect(mockGuestListService.remove).toHaveBeenCalledWith('1');
        });

        it('should throw Not Found error when guest list entry does not exist', async () => {
            // Mô phỏng trường hợp không tìm thấy khách mời
            mockGuestListService.remove.mockResolvedValue(null);

            // Kiểm tra hành vi khi không tìm thấy khách mời và ném ra lỗi
            await expect(controller.remove('1')).rejects.toThrow(HttpException);
            await expect(controller.remove('1')).rejects.toThrowError(new HttpException('Not Found', HttpStatus.NOT_FOUND));
        });
    });

});
