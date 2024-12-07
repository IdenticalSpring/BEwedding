// src/header-sections/entities/header-section.entity.ts
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class HeaderSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => WeddingDetail,
    (weddingDetail) => weddingDetail.headerSections,
  )
  @JoinColumn({ name: 'weddingId' })
  weddingDetail: WeddingDetail;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  backgroundUrl: string;

  @Column()
  metaData: string;
}
