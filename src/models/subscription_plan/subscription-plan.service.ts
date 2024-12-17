import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entity/subscription-plan.entity';

@Injectable()
export class SubscriptionPlanService {
    private readonly logger = new Logger(SubscriptionPlanService.name);

    constructor(
        @InjectRepository(SubscriptionPlan)
        private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    ) { }

    async findAll(): Promise<SubscriptionPlan[]> {
        try {
            return await this.subscriptionPlanRepository.find();
        } catch (error) {
            this.logger.error('Error fetching all subscription plans', error.stack);
            throw error;
        }
    }

    async findById(id: number): Promise<SubscriptionPlan> {
        try {
            const plan = await this.subscriptionPlanRepository.findOneBy({ id });
            if (!plan) {
                throw new NotFoundException(`Subscription Plan with ID ${id} not found`);
            }
            return plan;
        } catch (error) {
            this.logger.error(`Error fetching subscription plan with ID ${id}`, error.stack);
            throw error;
        }
    }

    async create(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
        try {
            const newPlan = this.subscriptionPlanRepository.create(data);
            return await this.subscriptionPlanRepository.save(newPlan);
        } catch (error) {
            this.logger.error('Error creating a new subscription plan', error.stack);
            throw error;
        }
    }

    async update(id: number, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
        try {
            await this.findById(id); // Check if exists
            await this.subscriptionPlanRepository.update(id, data);
            return await this.findById(id);
        } catch (error) {
            this.logger.error(`Error updating subscription plan with ID ${id}`, error.stack);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const result = await this.subscriptionPlanRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Subscription Plan with ID ${id} not found`);
            }
        } catch (error) {
            this.logger.error(`Error deleting subscription plan with ID ${id}`, error.stack);
            throw error;
        }
    }
    async findAllPaginated(page: number, limit: number): Promise<{ data: SubscriptionPlan[]; total: number; currentPage: number }> {
        try {
            const skip = (page - 1) * limit;

            const [data, total] = await this.subscriptionPlanRepository.findAndCount({
                skip,
                take: limit,
                order: { createdAt: 'DESC' },
            });

            return { data, total, currentPage: page };
        } catch (error) {
            this.logger.error('Error fetching all subscription plans with pagination', error.stack);
            throw error;
        }
    }
}
