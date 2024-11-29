import { Theme } from 'src/models/theme/entity/theme.enity';
import { User } from 'src/models/user/entity/user.entity';
import { WeddingDetail } from 'src/models/wedding-details/enitity/wedding-details.enity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.templates, { onDelete: 'CASCADE' })
  user: User;
}
