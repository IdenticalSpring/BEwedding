import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entity/subscription-plan.entity'; 

@Injectable()
export class SubscriptionPlanService {
    constructor(
        @InjectRepository(SubscriptionPlan)
        private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    ) { }

    async findAll(): Promise<SubscriptionPlan[]> {
        return await this.subscriptionPlanRepository.find();
    }

    async findById(id: number): Promise<SubscriptionPlan> {
        const plan = await this.subscriptionPlanRepository.findOneBy({ id });
        if (!plan) {
            throw new NotFoundException(`Subscription Plan with ID ${id} not found`);
        }
        return plan;
    }

    async create(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
        const newPlan = this.subscriptionPlanRepository.create(data);
        return await this.subscriptionPlanRepository.save(newPlan);
    }

    async update(id: number, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
        await this.findById(id); // Check if exists
        await this.subscriptionPlanRepository.update(id, data);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        const result = await this.subscriptionPlanRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Subscription Plan with ID ${id} not found`);
        }
    }
}
