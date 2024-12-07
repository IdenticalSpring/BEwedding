import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuestbookSectionDto } from './dto/create-guestbook-section.dto';
import { UpdateGuestbookSectionDto } from './dto/update-guestbook-section.dto';
import { GuestbookSection } from './entity/guestbook-section.entity';
import { WeddingDetail } from '../wedding-details/entity/wedding-details.entity';

@Injectable()
export class GuestbookSectionService {
  constructor(
    @InjectRepository(GuestbookSection)
    private readonly guestbookSectionRepository: Repository<GuestbookSection>,
    @InjectRepository(WeddingDetail)
    private readonly weddingDetailRepository: Repository<WeddingDetail>,
  ) {}

  async create(createGuestbookSectionDto: CreateGuestbookSectionDto) {
    const weddingDetail = await this.weddingDetailRepository.findOne({
      where: { id: createGuestbookSectionDto.weddingId },
    });

    if (!weddingDetail) {
      throw new Error('Wedding details not found');
    }

    const guestbookSection = this.guestbookSectionRepository.create(
      createGuestbookSectionDto,
    );
    guestbookSection.weddingDetail = weddingDetail;
    return this.guestbookSectionRepository.save(guestbookSection);
  }

  async findAll() {
    return this.guestbookSectionRepository.find({
      relations: ['weddingDetail'],
    });
  }

  async findOne(id: string) {
    return this.guestbookSectionRepository.findOne({
      where: { id },
      relations: ['weddingDetail'],
    });
  }

  async update(
    id: string,
    updateGuestbookSectionDto: UpdateGuestbookSectionDto,
  ) {
    const guestbookSection = await this.guestbookSectionRepository.findOne({
      where: { id },
    });

    if (!guestbookSection) {
      throw new Error('Guestbook section not found');
    }

    Object.assign(guestbookSection, updateGuestbookSectionDto);
    return this.guestbookSectionRepository.save(guestbookSection);
  }

  async remove(id: string) {
    const guestbookSection = await this.guestbookSectionRepository.findOne({
      where: { id },
    });

    if (!guestbookSection) {
      throw new Error('Guestbook section not found');
    }

    await this.guestbookSectionRepository.remove(guestbookSection);
  }
}
