// src/about-sections/about-section.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutSectionController } from './about-section.controller';
import { AboutSectionService } from './about-section.service';
import { WeddingDetail } from '../wedding-details/enitity/wedding-details.enity';
import { AboutSection } from './entity/about-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AboutSection, WeddingDetail])], // Đảm bảo import Entity WeddingDetail nếu cần
  controllers: [AboutSectionController],
  providers: [AboutSectionService],
})
export class AboutSectionModule {}
