// src/header-sections/header-sections.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderSectionService } from './header-section.service';
import { HeaderSectionController } from './header-section.controller';
import { HeaderSection } from './entity/header-section.entity';
import { WeddingDetail } from '../wedding-details/entity/wedding-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HeaderSection, WeddingDetail])],
  controllers: [HeaderSectionController],
  providers: [HeaderSectionService],
  exports: [HeaderSectionService],
})
export class HeaderSectionsModule {}
