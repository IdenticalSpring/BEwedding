import { Template } from 'src/models/template/entity/template.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'json', nullable: true })
  style: Record<string, any>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  theme: string;

  @Column({ type: 'uuid', nullable: true })
  templateId: string;

  @ManyToOne(() => Template, (template) => template.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'templateId' })
  template: Template;

  @Column({ type: 'varchar', nullable: true })
  position: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
