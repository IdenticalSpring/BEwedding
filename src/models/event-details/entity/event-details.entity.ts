// src/event-details/entities/event-detail.entity.ts
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('event_details')
export class EventDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WeddingDetail, (weddingDetail) => weddingDetail.eventDetails)
  @JoinColumn({ name: 'weddingId' })
  weddingDetail: WeddingDetail;

  @Column()
  eventName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Lưu thời gian với múi giờ
  eventDate: Date;

  @Column()
  location: string;

  @Column('text')
  description: string;

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
