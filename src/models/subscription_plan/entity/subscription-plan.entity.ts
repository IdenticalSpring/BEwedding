import { Template } from 'src/models/template/entity/template.entity'; // Import Template
import { Subscription } from 'src/models/subscription/entity/subscription.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

@Entity('subscription_plans')
export class SubscriptionPlan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    price: number;

    @Column({ type: 'int', default: 1, nullable: true })
    duration: number; // Thời gian gói (số tháng)

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Liên kết với bảng Subscription
    @OneToMany(() => Subscription, (subscription) => subscription.subscriptionPlan)
    subscriptions: Subscription[];

    // Liên kết với bảng Template
    @OneToMany(() => Template, (template) => template.subscriptionPlan)
    templates: Template[]; // Quan hệ với Template
}
