// src/header-sections/header-sections.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderSectionService } from 'src/models/header-section/header-section.service'; 
import { HeaderSection } from 'src/models/header-section/entity/header-section.entity'; 
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity'; 
import { AdminHeaderSectionController } from './header-section.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HeaderSection, WeddingDetail])],
  controllers: [AdminHeaderSectionController],
  providers: [HeaderSectionService],
})
export class AdminHeaderSectionsModule {}
