import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestbookSectionService } from './guestbook-section.service';
import { GuestbookSectionController } from './guestbook-section.controller';
import { GuestbookSection } from './entity/guestbook-section.enity';
import { WeddingDetail } from '../wedding-details/enitity/wedding-details.enity';

@Module({
  imports: [TypeOrmModule.forFeature([GuestbookSection, WeddingDetail])],
  controllers: [GuestbookSectionController],
  providers: [GuestbookSectionService],
})
export class GuestbookSectionModule {}
