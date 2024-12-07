
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutSectionController } from './about-section.controller';
import { AboutSectionService } from './about-section.service';
import { WeddingDetail } from '../wedding-details/entity/wedding-details.entity';
import { AboutSection } from './entity/about-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AboutSection, WeddingDetail])], 
  controllers: [AboutSectionController],
  providers: [AboutSectionService],
  exports: [AboutSectionService],
})
export class AboutSectionModule {}
