import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GallerySectionService } from 'src/models/gallery-section/gallery-section.service'; 
import { GallerySection } from 'src/models/gallery-section/entity/gallery-section.entity'; 
import { WeddingDetail } from 'src/models/wedding-details/entity/wedding-details.entity'; 
import { AdminGallerySectionController } from './gallery-section.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GallerySection, WeddingDetail]), AuthModule],
  controllers: [AdminGallerySectionController],
  providers: [GallerySectionService],
})
export class AdminGallerySectionModule {}
