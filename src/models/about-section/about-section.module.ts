
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutSectionController } from './about-section.controller';
import { AboutSectionService } from './about-section.service';
import { WeddingDetail } from '../wedding-details/entity/wedding-details.entity';
import { AboutSection } from './entity/about-section.entity';
import { WeddingDetailService } from '../wedding-details/wedding-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([AboutSection, WeddingDetail])], 
  controllers: [AboutSectionController],
  providers: [AboutSectionService, WeddingDetailService],
  exports: [AboutSectionService],
})
export class AboutSectionModule {}
