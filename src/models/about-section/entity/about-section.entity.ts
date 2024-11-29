// src/about-sections/entities/about-section.entity.ts
import { WeddingDetail } from 'src/models/wedding-details/enitity/wedding-details.enity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class AboutSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => WeddingDetail,
    (weddingDetail) => weddingDetail.aboutSections,
  )
  @JoinColumn({ name: 'weddingId' })
  weddingDetail: WeddingDetail;

  @Column('text')
  brideBio: string;

  @Column('text')
  groomBio: string;

  @Column('simple-array')
  imageUrls: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('text')
  metaData: string;
}
