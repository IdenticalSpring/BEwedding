// src/wedding-details/entities/wedding-detail.entity.ts
import { AboutSection } from 'src/models/about-section/entity/about-section.entity';
import { EventDetail } from 'src/models/event-details/entity/event-details.entity';
import { GallerySection } from 'src/models/gallery-section/entity/gallery-section.entity';
import { GuestList } from 'src/models/guest/entity/guest.entity';
import { GuestbookSection } from 'src/models/guestbook-section/entity/guestbook-section.entity';
import { HeaderSection } from 'src/models/header-section/entity/header-section.entity';
import { templateUser } from 'src/models/template-user/entity/template-user.entity';
import { Template } from 'src/models/template/entity/template.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('wedding_details')
export class WeddingDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  brideName: string;

  @Column({ type: 'varchar', length: 255 })
  groomName: string;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bankAccount: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cryptoWallet: string;

  @Column()
  metaData: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => HeaderSection,
    (headerSection) => headerSection.weddingDetail,
  )
  headerSections: HeaderSection[];

  @OneToMany(() => AboutSection, (aboutSection) => aboutSection.weddingDetail)
  aboutSections: AboutSection[];

  @OneToMany(() => EventDetail, (eventDetail) => eventDetail.weddingDetail)
  eventDetails: EventDetail[];

  @OneToMany(
    () => GallerySection,
    (gallerySections) => gallerySections.weddingDetail,
  )
  gallerySection: GallerySection[];

  @OneToMany(
    () => GuestbookSection,
    (guestbookSections) => guestbookSections.weddingDetail,
  )
  guestbookSections: GallerySection[];

  @ManyToOne(() => templateUser, (template) => template.weddingDetails)
  templateUser: templateUser;

  @OneToMany(() => GuestList, (guestLists) => guestLists.weddingDetail)
  guestLists: GuestList[];
}
