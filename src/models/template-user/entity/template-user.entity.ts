import { GallerySection } from 'src/models/gallery-section/entity/gallery-section.entity';
import { GuestList } from 'src/models/guest/entity/guest.entity';
import { SectionUser } from 'src/models/section-user/entity/section-user.entity';
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
  JoinColumn,
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

  @Column({ type: 'varchar', length: 255, unique: true })
  linkName: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Theme, (theme) => theme.template)
  theme: Theme[];

  @OneToMany(() => WeddingDetail, (weddingDetail) => weddingDetail.templateUser)
  weddingDetails: WeddingDetail[];

  @ManyToOne(() => User, (user) => user.template_user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => SectionUser, (section) => section.template, {
    cascade: true,
  })
  section_user: SectionUser[];
}
