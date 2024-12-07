import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GallerySectionService } from 'src/models/gallery-section/gallery-section.service'; 
import { GallerySection } from 'src/models/gallery-section/entity/gallery-section.entity'; 
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity'; 
import { AdminGallerySectionController } from './gallery-section.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GallerySection, WeddingDetail])],
  controllers: [AdminGallerySectionController],
  providers: [GallerySectionService],
})
export class AdminGallerySectionModule {}
