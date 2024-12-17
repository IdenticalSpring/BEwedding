import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from 'src/models/subscription_plan/entity/subscription-plan.entity';  
import { SubscriptionPlanService } from 'src/models/subscription_plan/subscription-plan.service';
import { AdminSubscriptionPlanController } from './subscription-plan.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SubscriptionPlan])],
    controllers: [AdminSubscriptionPlanController],
    providers: [SubscriptionPlanService],
    exports: [SubscriptionPlanService],
})
export class AdminSubscriptionPlanModule { }
