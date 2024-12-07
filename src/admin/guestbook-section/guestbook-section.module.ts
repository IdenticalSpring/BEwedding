import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestbookSectionService } from 'src/models/guestbook-section/guestbook-section.service'; 
import { GuestbookSection } from 'src/models/guestbook-section/entity/guestbook-section.entity'; 
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity'; 
import { AdminGuestbookSectionController } from './guestbook-section.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GuestbookSection, WeddingDetail])],
  controllers: [AdminGuestbookSectionController],
  providers: [GuestbookSectionService],
})
export class AdminGuestbookSectionModule {}