import { Template } from 'src/models/template/entity/template.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  theme: string;

  @ManyToOne(() => Template, (template) => template.sections, {
    onDelete: 'CASCADE',
  })
  template: Template;

  @Column({ type: 'varchar', nullable: true })
  position: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
