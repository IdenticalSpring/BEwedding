import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/models/subscription/entity/subscription.entity'; 
import { SubscriptionPlan } from 'src/models/subscription_plan/entity/subscription-plan.entity'; 
import { User } from 'src/models/user/entity/user.entity'; 
import {  AdminSubscriptionController } from './subscription.controller';
import { SubscriptionService } from 'src/models/subscription/subscription.service'; 
import { PayOSModule } from 'src/models/subscription/payos.module'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription, SubscriptionPlan, User] ),PayOSModule
    ],
    controllers: [AdminSubscriptionController],
    providers: [SubscriptionService],
    exports: [SubscriptionService],
})
export class AdminSubscriptionModule { }
