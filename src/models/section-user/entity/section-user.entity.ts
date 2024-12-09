import { TemplateUser } from 'src/models/template-user/entity/template-user.entity';
import { Template } from 'src/models/template/entity/template.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('sectionUser')
export class SectionUser {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  theme: string;

  @Column({ type: 'uuid', nullable: true })
  templateId: string;

  @ManyToOne(() => TemplateUser, (templateUser) => templateUser.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'templateId' })
  template: TemplateUser;

  @Column({ type: 'varchar', nullable: true })
  position: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
