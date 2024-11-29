import { WeddingDetail } from 'src/models/wedding-details/enitity/wedding-details.enity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class GallerySection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  weddingId: string;

  @ManyToOne(
    () => WeddingDetail,
    (weddingDetail) => weddingDetail.gallerySection,
  )
  @JoinColumn({ name: 'weddingId' })
  weddingDetail: WeddingDetail;

  @Column('simple-array')
  imageUrls: string[];

  @Column()
  metaData: string;
}
