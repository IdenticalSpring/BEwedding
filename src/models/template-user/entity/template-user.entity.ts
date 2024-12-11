import { Section } from 'src/models/section/entity/section.entity';
import { Theme } from 'src/models/theme/entity/theme.entity';
import { User } from 'src/models/user/entity/user.entity';
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('template_user')
export class templateUser {
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

  @Column({
    type: 'enum',
    enum: ['FREE', 'VIP'],
    default: 'FREE',
  })
  accessType: 'FREE' | 'VIP';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Theme, (theme) => theme.template)
  theme: Theme[];

  @OneToMany(() => WeddingDetail, (weddingDetail) => weddingDetail.template)
  weddingDetails: WeddingDetail[];

  @ManyToOne(() => User, (user) => user.template_user, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Section, (section) => section.template, { cascade: true })
  sections: Section[];
}
