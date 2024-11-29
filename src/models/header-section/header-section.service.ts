// src/header-sections/header-section.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHeaderSectionDto } from './dto/create-header-section.dto';
import { UpdateHeaderSectionDto } from './dto/update-header-section.dto';
import { HeaderSection } from './entity/header-section.entity';
import { WeddingDetail } from '../wedding-details/enitity/wedding-details.enity';

@Injectable()
export class HeaderSectionService {
  constructor(
    @InjectRepository(HeaderSection)
    private readonly headerSectionRepository: Repository<HeaderSection>,
    @InjectRepository(WeddingDetail)
    private readonly weddingDetailRepository: Repository<WeddingDetail>,
  ) {}

  async create(createHeaderSectionDto: CreateHeaderSectionDto) {
    const weddingDetail = await this.weddingDetailRepository.findOne({
      where: { id: createHeaderSectionDto.weddingId },
    });

    if (!weddingDetail) {
      throw new Error('Wedding details not found');
    }

    const headerSection = this.headerSectionRepository.create(
      createHeaderSectionDto,
    );
    headerSection.weddingDetail = weddingDetail;

    return this.headerSectionRepository.save(headerSection);
  }

  findAll() {
    return this.headerSectionRepository.find({ relations: ['weddingDetail'] });
  }

  findOne(id: string) {
    return this.headerSectionRepository.findOne({
      where: { id },
      relations: ['weddingDetail'],
    });
  }

  async update(id: string, updateHeaderSectionDto: UpdateHeaderSectionDto) {
    const headerSection = await this.headerSectionRepository.findOne({
      where: { id },
    });

    if (!headerSection) {
      throw new Error('Header section not found');
    }

    Object.assign(headerSection, updateHeaderSectionDto);
    return this.headerSectionRepository.save(headerSection);
  }

  async remove(id: string) {
    const headerSection = await this.headerSectionRepository.findOne({
      where: { id },
    });

    if (!headerSection) {
      throw new Error('Header section not found');
    }

    await this.headerSectionRepository.remove(headerSection);
  }
}
