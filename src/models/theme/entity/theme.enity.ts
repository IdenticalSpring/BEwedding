import { Template } from 'src/models/template/entity/template.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Theme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  templateId: string;

  @ManyToOne(() => Template, (template) => template.theme)
  @JoinColumn({ name: 'templateId' })
  template: Template;

  @Column()
  themeName: string;

  @Column()
  primaryColor: string;

  @Column()
  secondaryColor: string;

  @Column()
  metaData: string;
}
