import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestbookSectionService } from './guestbook-section.service';
import { GuestbookSectionController } from './guestbook-section.controller';
import { GuestbookSection } from './entity/guestbook-section.entity';
import { WeddingDetail } from '../wedding-details/entity/wedding-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuestbookSection, WeddingDetail])],
  controllers: [GuestbookSectionController],
  providers: [GuestbookSectionService],
  exports: [GuestbookSectionService],
})
export class GuestbookSectionModule {}
