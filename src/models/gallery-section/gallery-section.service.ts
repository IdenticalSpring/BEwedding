import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGallerySectionDto } from './dto/create-gallery-section.dto';
import { GallerySection } from './entity/gallery-section.entity';
import { UpdateGallerySectionDto } from './dto/update-gallery-section.dto';
import { WeddingDetail } from '../wedding-details/enitity/wedding-details.enity';

@Injectable()
export class GallerySectionService {
  constructor(
    @InjectRepository(GallerySection)
    private readonly gallerySectionRepository: Repository<GallerySection>,
    @InjectRepository(WeddingDetail)
    private readonly weddingDetailRepository: Repository<WeddingDetail>,
  ) {}

  async create(createGallerySectionDto: CreateGallerySectionDto) {
    const weddingDetail = await this.weddingDetailRepository.findOne({
      where: { id: createGallerySectionDto.weddingId },
    });

    if (!weddingDetail) {
      throw new Error('Wedding details not found');
    }

    const gallerySection = this.gallerySectionRepository.create(
      createGallerySectionDto,
    );
    gallerySection.weddingDetail = weddingDetail;
    return this.gallerySectionRepository.save(gallerySection);
  }

  async findAll() {
    return this.gallerySectionRepository.find({ relations: ['weddingDetail'] });
  }

  async findOne(id: string) {
    return this.gallerySectionRepository.findOne({
      where: { id },
      relations: ['weddingDetail'],
    });
  }

  async update(id: string, updateGallerySectionDto: UpdateGallerySectionDto) {
    const gallerySection = await this.gallerySectionRepository.findOne({
      where: { id },
    });

    if (!gallerySection) {
      throw new Error('Gallery section not found');
    }

    Object.assign(gallerySection, updateGallerySectionDto);
    return this.gallerySectionRepository.save(gallerySection);
  }

  async remove(id: string) {
    const gallerySection = await this.gallerySectionRepository.findOne({
      where: { id },
    });

    if (!gallerySection) {
      throw new Error('Gallery section not found');
    }

    await this.gallerySectionRepository.remove(gallerySection);
  }
}
