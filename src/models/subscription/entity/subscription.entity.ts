import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from 'src/models/user/entity/user.entity';
import { SubscriptionPlan } from 'src/models/subscription_plan/entity/subscription-plan.entity';

export enum SubscriptionStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    FAILED = 'failed',
}

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions, { onDelete: 'CASCADE' })
    subscriptionPlan: SubscriptionPlan;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING })
    status: SubscriptionStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    orderCode: number;

    @Column({ nullable: true })
    paymentLinkId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date;
}
