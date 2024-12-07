// src/event-details/event-detail.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventDetail } from './entity/event-details.entity';
import { WeddingDetail } from '../wedding-details/entity/wedding-details.entity';
import { EventDetailService } from './event-details.service';
import { EventDetailController } from './event-details.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventDetail, WeddingDetail])],
  controllers: [EventDetailController],
  providers: [EventDetailService],
  exports: [EventDetailService],
})
export class EventDetailModule {}
