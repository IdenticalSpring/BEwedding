import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum GuestStatus {
  INVITED = 'Invited',
  CONFIRMED = 'Confirmed',
  DECLINED = 'Declined',
}

@Entity()
export class GuestList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  weddingId: string;

  @ManyToOne(() => WeddingDetail, (wedding) => wedding.guestLists)
  @JoinColumn({ name: 'weddingId' })
  weddingDetail: WeddingDetail;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  relationship: string;

  @Column({
    type: 'enum',
    enum: GuestStatus,
    default: GuestStatus.INVITED,
  })
  status: GuestStatus;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ nullable: true })
  tableNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
