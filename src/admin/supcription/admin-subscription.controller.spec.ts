import { Test, TestingModule } from '@nestjs/testing';
import { AdminSubscriptionController } from './subscription.controller'; 
import { SubscriptionService } from 'src/models/subscription/subscription.service';
import { CreateSubscriptionDto } from 'src/models/subscription/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from 'src/models/subscription/dto/update-subcription.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AdminSubscriptionController', () => {
    let controller: AdminSubscriptionController;
    let service: SubscriptionService;

    const mockSubscriptionService = {
        createSubscription: jest.fn(),
        updateSubscriptionStatus: jest.fn(), 
        deleteSubscription: jest.fn(),
        getSubscriptions: jest.fn(),
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminSubscriptionController],
            providers: [
                { provide: SubscriptionService, useValue: mockSubscriptionService },
            ],
        }).compile();

        controller = module.get<AdminSubscriptionController>(AdminSubscriptionController);
        service = module.get<SubscriptionService>(SubscriptionService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('POST /admin/subscriptions/create', () => {
        it('should create or update a subscription', async () => {
            const dto: CreateSubscriptionDto = {
                userId: 1,
                planId: 2,
                confirmChange: true,
            };
            const response = { message: 'Subscription created', paymentUrl: 'http://payment-link.com' };

            mockSubscriptionService.createSubscription.mockResolvedValue(response);

            expect(await controller.createOrUpdateSubscription(dto)).toEqual(response);
            expect(service.createSubscription).toHaveBeenCalledWith(1, 2, true);
        });
    });

    describe('PATCH /admin/subscriptions/update-status', () => {
        it('should update the subscription status', async () => {
            const dto: UpdateSubscriptionDto = {
                orderCode: 12343412,
                success: true,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
            };

            await controller.updateStatus(dto);

            // Assert the method was called with expected arguments
            expect(service.updateSubscriptionStatus).toHaveBeenCalledWith(
                12343412,
                true,
                dto.startDate,
                dto.endDate,
            );

            // Optionally verify the actual arguments passed
            const callArgs = (service.updateSubscriptionStatus as jest.Mock).mock.calls[0];
            expect(callArgs[0]).toBe(12343412); // orderCode
            expect(callArgs[1]).toBe(true); // success
            expect(callArgs[2]).toEqual(dto.startDate); // startDate
            expect(callArgs[3]).toEqual(dto.endDate); // endDate
        });




        it('should throw BadRequestException if required fields are missing', async () => {
            const dto: any = { orderCode: '', success: undefined };

            await expect(controller.updateStatus(dto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('GET /admin/subscriptions', () => {
        it('should return all subscriptions with pagination', async () => {
            const response = { data: [{ id: 1, userId: 1 }], total: 10, page: 1, limit: 10 };

            mockSubscriptionService.getSubscriptions.mockResolvedValue(response);

            const result = await controller.getAllSubscriptions({ page: 1, limit: 10 });

            expect(result).toEqual(response);
            expect(service.getSubscriptions).toHaveBeenCalledWith(1, 10);
        });
    });

    describe('DELETE /admin/subscriptions/:id', () => {
        it('should delete a subscription by ID', async () => {
            const response = { message: 'Subscription deleted successfully' };

            mockSubscriptionService.deleteSubscription.mockResolvedValue(response);

            expect(await controller.deleteSubscription(1)).toEqual(response);
            expect(service.deleteSubscription).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException if subscription is not found', async () => {
            mockSubscriptionService.deleteSubscription.mockRejectedValue(
                new NotFoundException('Subscription not found'),
            );

            await expect(controller.deleteSubscription(999)).rejects.toThrow(NotFoundException);
            expect(service.deleteSubscription).toHaveBeenCalledWith(999);
        });
    });
});
