import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAboutSectionDto } from './dto/create-about-section.dto';
import { AboutSection } from './entity/about-section.entity';
import { WeddingDetail } from '../wedding-details/entity/wedding-details.entity';
import { UpdateAboutSectionDto } from './dto/update-about-section.dto';

@Injectable()
export class AboutSectionService {
  constructor(
    @InjectRepository(AboutSection)
    private readonly aboutSectionRepository: Repository<AboutSection>,
    @InjectRepository(WeddingDetail)
    private readonly weddingDetailRepository: Repository<WeddingDetail>,
  ) { }

  async create(createAboutSectionDto: CreateAboutSectionDto) {

    const weddingDetail = await this.weddingDetailRepository.findOne({
      where: { id: createAboutSectionDto.weddingId },
    });

    if (!weddingDetail) {
      throw new BadRequestException('Wedding details not found');
    }

    const aboutSection = this.aboutSectionRepository.create(createAboutSectionDto);

    aboutSection.weddingDetail = weddingDetail;

    return this.aboutSectionRepository.save(aboutSection);
  }


  async findAll() {
    return this.aboutSectionRepository.find({ relations: ['weddingDetail'] });
  }

  async findOne(id: string) {
    const aboutSection = await this.aboutSectionRepository.findOne({
      where: { id },
      relations: ['weddingDetail'],
    });

    if (!aboutSection) {
      throw new NotFoundException('About section not found');
    }

    return aboutSection;
  }

  async update(id: string, updateAboutSectionDto: UpdateAboutSectionDto) {
    const aboutSection = await this.aboutSectionRepository.findOne({
      where: { id },
    });

    if (!aboutSection) {
      throw new NotFoundException('About section not found');
    }

    Object.assign(aboutSection, updateAboutSectionDto);
    return this.aboutSectionRepository.save(aboutSection);
  }


  async remove(id: string) {
    const aboutSection = await this.aboutSectionRepository.findOne({
      where: { id },
    });

    if (!aboutSection) {
      throw new NotFoundException('About section not found');
    }

    await this.aboutSectionRepository.remove(aboutSection);
  }
  
}
