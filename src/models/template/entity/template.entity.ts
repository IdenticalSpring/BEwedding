import { Section } from 'src/models/section/entity/section.entity';
import { Theme } from 'src/models/theme/entity/theme.entity';
import { SubscriptionPlan } from 'src/models/subscription_plan/entity/subscription-plan.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Invitation } from 'src/models/invitation/entity/invitation.entity';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  thumbnailUrl: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  metaData: string;

  // Liên kết với bảng SubscriptionPlan
  @ManyToOne(() => SubscriptionPlan, (subscriptionPlan) => subscriptionPlan.templates, {
    nullable: true, // Cho phép NULL nếu không liên kết với SubscriptionPlan
    onDelete: 'SET NULL', // Khi SubscriptionPlan bị xóa, đặt trường này là NULL
  })
  @JoinColumn({ name: 'subscriptionPlanId' }) // Khóa ngoại subscriptionPlanId
  subscriptionPlan: SubscriptionPlan;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Theme, (theme) => theme.template)
  theme: Theme[];

  @OneToMany(() => Section, (section) => section.template, { cascade: true })
  sections: Section[];
  @OneToOne(() => Invitation, (invitation) => invitation.template)
  invitation: Invitation;
}
