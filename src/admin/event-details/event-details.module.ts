// src/event-details/event-detail.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventDetail } from 'src/models/event-details/entity/event-details.entity'; 
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity'; 
import { EventDetailService } from 'src/models/event-details/event-details.service'; 
import { AdminEventDetailController } from './event-details.controller';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([EventDetail, WeddingDetail]),AuthModule],
  controllers: [AdminEventDetailController],
  providers: [EventDetailService],
})
export class AdminEventDetailModule {}
