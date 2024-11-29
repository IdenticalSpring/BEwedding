import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GallerySectionService } from './gallery-section.service';
import { GallerySectionController } from './gallery-section.controller';
import { GallerySection } from './entity/gallery-section.entity';
import { WeddingDetail } from '../wedding-details/enitity/wedding-details.enity';

@Module({
  imports: [TypeOrmModule.forFeature([GallerySection, WeddingDetail])],
  controllers: [GallerySectionController],
  providers: [GallerySectionService],
})
export class GallerySectionModule {}
