
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPlanController } from './subscription-plan.controller'; 
import { SubscriptionPlanService } from 'src/models/subscription_plan/subscription-plan.service';
import { CreateSubscriptionPlanDto } from 'src/models/subscription_plan/dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from 'src/models/subscription_plan/dto/update-subscription-plan.dto';
import { SubscriptionPlan } from 'src/models/subscription_plan/entity/subscription-plan.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SubscriptionPlanController', () => {
    let controller: SubscriptionPlanController;
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
            controllers: [SubscriptionPlanController],
            providers: [
                {
                    provide: SubscriptionPlanService,
                    useValue: mockSubscriptionPlanService,
                },
            ],
        }).compile();

        controller = module.get<SubscriptionPlanController>(SubscriptionPlanController);
        service = module.get<SubscriptionPlanService>(SubscriptionPlanService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
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
});