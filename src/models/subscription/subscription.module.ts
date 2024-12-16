import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entity/subscription.entity';
import { SubscriptionPlan } from '../subscription_plan/entity/subscription-plan.entity';
import { User } from '../user/entity/user.entity';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PayOSModule } from './payos.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription, SubscriptionPlan, User] ),PayOSModule
    ],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
    exports: [SubscriptionService],
})
export class SubscriptionModule { }
