// src/admin/subscription-plan/admin-subscription-plan.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AdminSubscriptionPlanController } from '../supcription_plan/subscription-plan.controller'; 
import { SubscriptionPlanService } from 'src/models/subscription_plan/subscription-plan.service';
import { CreateSubscriptionPlanDto } from 'src/models/subscription_plan/dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from 'src/models/subscription_plan/dto/update-subscription-plan.dto';
import { SubscriptionPlan } from 'src/models/subscription_plan/entity/subscription-plan.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AdminSubscriptionPlanController', () => {
    let controller: AdminSubscriptionPlanController;
    let service: SubscriptionPlanService;

    const mockSubscriptionPlanService = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAllPaginated: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminSubscriptionPlanController],
            providers: [
                {
                    provide: SubscriptionPlanService,
                    useValue: mockSubscriptionPlanService,
                },
            ],
        }).compile();

        controller = module.get<AdminSubscriptionPlanController>(AdminSubscriptionPlanController);
        service = module.get<SubscriptionPlanService>(SubscriptionPlanService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new subscription plan', async () => {
            const createDto: CreateSubscriptionPlanDto = {
                name: 'Premium Plan',
                description: 'Full access to all features',
                price: 29.99,
                duration: 12,
            };

            const result: SubscriptionPlan = {
                id: 1,
                name: 'Premium Plan',
                description: 'Full access to all features',
                price: 29.99,
                duration: 12,
                createdAt: new Date(),
                updatedAt: new Date(),
                subscriptions: []
            };

            mockSubscriptionPlanService.create.mockResolvedValue(result);

            expect(await controller.create(createDto)).toEqual(result);
            expect(mockSubscriptionPlanService.create).toHaveBeenCalledWith(createDto);
        });

        it('should throw an error if creation fails', async () => {
            const createDto: CreateSubscriptionPlanDto = {
                name: 'Invalid Plan',
                price: -10, // Invalid price
                duration: 0, // Invalid duration
            };

            mockSubscriptionPlanService.create.mockRejectedValue(
                new HttpException('Invalid data', HttpStatus.BAD_REQUEST),
            );

            await expect(controller.create(createDto)).rejects.toThrow(HttpException);
            await expect(controller.create(createDto)).rejects.toThrow('Invalid data');
        });
    });

    describe('findAll', () => {
        it('should return an array of subscription plans', async () => {
            const result: SubscriptionPlan[] = [
                {
                    id: 1,
                    name: 'Premium Plan',
                    description: 'Full access to all features',
                    price: 29.99,
                    duration: 12,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    subscriptions: []
                },
                {
                    id: 2,
                    name: 'Basic Plan',
                    description: 'Limited access',
                    price: 9.99,
                    duration: 6,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    subscriptions: []
                },
            ];

            mockSubscriptionPlanService.findAll.mockResolvedValue(result);

            expect(await controller.findAll()).toEqual(result);
            expect(mockSubscriptionPlanService.findAll).toHaveBeenCalled();
        });

        it('should return an empty array if no subscription plans found', async () => {
            mockSubscriptionPlanService.findAll.mockResolvedValue([]);

            expect(await controller.findAll()).toEqual([]);
            expect(mockSubscriptionPlanService.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a subscription plan by ID', async () => {
            const result: SubscriptionPlan = {
                id: 1,
                name: 'Premium Plan',
                description: 'Full access to all features',
                price: 29.99,
                duration: 12,
                createdAt: new Date(),
                updatedAt: new Date(),
                subscriptions: []
            };

            mockSubscriptionPlanService.findById.mockResolvedValue(result);

            expect(await controller.findById(1)).toEqual(result);
            expect(mockSubscriptionPlanService.findById).toHaveBeenCalledWith(1);
        });

        it('should throw a Not Found error if subscription plan does not exist', async () => {
            mockSubscriptionPlanService.findById.mockRejectedValue(
                new HttpException('Subscription Plan not found', HttpStatus.NOT_FOUND)
            );

            await expect(controller.findById(999)).rejects.toThrow(HttpException);
            await expect(controller.findById(999)).rejects.toThrowError(
                new HttpException('Subscription Plan not found', HttpStatus.NOT_FOUND)
            );
        });
    });

    describe('update', () => {
        it('should update a subscription plan by ID', async () => {
            const updateDto: UpdateSubscriptionPlanDto = {
                name: 'Updated Premium Plan',
                price: 39.99,
            };

            const result: SubscriptionPlan = {
                id: 1,
                name: 'Updated Premium Plan',
                description: 'Full access to all features',
                price: 39.99,
                duration: 12,
                createdAt: new Date(),
                updatedAt: new Date(),
                subscriptions: []
            };

            mockSubscriptionPlanService.update.mockResolvedValue(result);

            expect(await controller.update(1, updateDto)).toEqual(result);
            expect(mockSubscriptionPlanService.update).toHaveBeenCalledWith(1, updateDto);
        });

        it('should throw a Not Found error if subscription plan to update does not exist', async () => {
            const updateDto: UpdateSubscriptionPlanDto = {
                name: 'Non-existent Plan',
            };

            mockSubscriptionPlanService.update.mockRejectedValue(
                new HttpException('Subscription Plan not found', HttpStatus.NOT_FOUND)
            );

            await expect(controller.update(999, updateDto)).rejects.toThrow(HttpException);
            await expect(controller.update(999, updateDto)).rejects.toThrowError(
                new HttpException('Subscription Plan not found', HttpStatus.NOT_FOUND)
            );
        });
    });


    describe('delete', () => {
        it('should delete a subscription plan by ID and return a success message', async () => {
            mockSubscriptionPlanService.delete.mockResolvedValue(undefined); // Assuming delete returns void

            await expect(controller.delete(1)).resolves.toEqual({
                message: 'Subscription Plan with ID 1 has been deleted',
            });
            expect(mockSubscriptionPlanService.delete).toHaveBeenCalledWith(1);
        });

        it('should throw a Not Found error if subscription plan to delete does not exist', async () => {
            mockSubscriptionPlanService.delete.mockRejectedValue(
                new HttpException('Subscription Plan not found', HttpStatus.NOT_FOUND),
            );

            await expect(controller.delete(999)).rejects.toThrow(HttpException);
            await expect(controller.delete(999)).rejects.toThrowError(
                new HttpException('Subscription Plan not found', HttpStatus.NOT_FOUND),
            );
        });
    });

    describe('findAllPaginated', () => {
        it('should return paginated subscription plans', async () => {
            const page = 1;
            const limit = 10;

            const result = {
                data: [
                    {
                        id: 1,
                        name: 'Premium Plan',
                        description: 'Full access to all features',
                        price: 29.99,
                        duration: 12,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    // ...more plans
                ],
                total: 15,
                currentPage: 1,
            };

            mockSubscriptionPlanService.findAllPaginated.mockResolvedValue(result);

            expect(await controller.findAllPaginated(page, limit)).toEqual(result);
            expect(mockSubscriptionPlanService.findAllPaginated).toHaveBeenCalledWith(page, limit);
        });

        it('should handle cases where no subscription plans are found in paginated results', async () => {
            const page = 2;
            const limit = 10;

            const result = {
                data: [],
                total: 15,
                currentPage: 2,
            };

            mockSubscriptionPlanService.findAllPaginated.mockResolvedValue(result);

            expect(await controller.findAllPaginated(page, limit)).toEqual(result);
            expect(mockSubscriptionPlanService.findAllPaginated).toHaveBeenCalledWith(page, limit);
        });
    });
});
