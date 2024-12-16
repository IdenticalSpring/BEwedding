
import { Subscription } from 'src/models/subscription/entity/subscription.entity';
import { User } from 'src/models/user/entity/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

@Entity()
export class SubscriptionPlan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    price: number;
    @Column({ type: 'int', default: 1,nullable: true }) 
    duration: number;
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Subscription, (subscription) => subscription.subscriptionPlan)
    subscriptions: Subscription[];
}
