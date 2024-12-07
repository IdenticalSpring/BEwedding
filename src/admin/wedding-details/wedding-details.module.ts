// src/wedding-details/wedding-detail.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity'; 
import { WeddingDetailService } from 'src/models/wedding-details/wedding-details.service'; 
import { AdminWeddingDetailController } from './wedding-details.controller';


@Module({
  imports: [TypeOrmModule.forFeature([WeddingDetail])],
  controllers: [AdminWeddingDetailController],
  providers: [WeddingDetailService],
})
export class AdminWeddingDetailModule {}