// src/about-sections/about-section.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  AdminAboutSectionController } from './about-section.controller';
import { AboutSection } from 'src/models/about-section/entity/about-section.entity';
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity';
import { AboutSectionService } from 'src/models/about-section/about-section.service';
import { WeddingDetailService } from 'src/models/wedding-details/wedding-details.service';


@Module({
  imports: [TypeOrmModule.forFeature([AboutSection, WeddingDetail])], 
  controllers: [AdminAboutSectionController],
  providers: [AboutSectionService,WeddingDetailService],
})
export class AdminAboutSectionModule {}
