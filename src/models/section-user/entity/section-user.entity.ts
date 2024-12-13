import { templateUser } from 'src/models/template-user/entity/template-user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('section_user')
export class SectionUser {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'json', nullable: true })
  style: Record<string, any>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  theme: string;

  @Column({ type: 'uuid', nullable: true })
  template_userId: string;

  @ManyToOne(() => templateUser, (template) => template.section_user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'template_userId' })
  template: templateUser;

  @Column({ type: 'varchar', nullable: true })
  position: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
