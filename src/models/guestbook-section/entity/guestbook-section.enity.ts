import { WeddingDetail } from 'src/models/wedding-details/enitity/wedding-details.enity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class GuestbookSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  weddingId: string;

  @ManyToOne(
    () => WeddingDetail,
    (weddingDetail) => weddingDetail.guestbookSections,
  )
  @JoinColumn({ name: 'weddingId' })
  weddingDetail: WeddingDetail;

  @Column()
  guestName: string;

  @Column('text')
  message: string;

  @Column('text')
  metaData: string;
}
