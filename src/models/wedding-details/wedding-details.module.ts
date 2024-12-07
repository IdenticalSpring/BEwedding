// src/wedding-details/wedding-detail.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeddingDetail } from './entity/wedding-details.entity';
import { WeddingDetailService } from './wedding-details.service';
import { WeddingDetailController } from './wedding-details.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WeddingDetail])],
  controllers: [WeddingDetailController],
  providers: [WeddingDetailService],
  exports: [WeddingDetailService],
})
export class WeddingDetailModule {}
