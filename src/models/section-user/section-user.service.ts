import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectionUserDto } from './dto/create-section-user.dto';
import { UpdateSectionUserDto } from './dto/update-section-user.dto';
import { SectionUser } from './entity/section-user.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(SectionUser)
    private readonly sectionRepository: Repository<SectionUser>,
  ) {}

  async create(createSectionDto: CreateSectionUserDto): Promise<SectionUser> {
    const section = this.sectionRepository.create(createSectionDto);
    return this.sectionRepository.save(section);
  }

  async findAll(): Promise<SectionUser[]> {
    return this.sectionRepository.find();
  }

  async findOne(id: number): Promise<SectionUser> {
    const section = await this.sectionRepository.findOne({ where: { id } });
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

  async update(
    id: number,
    updateSectionDto: UpdateSectionUserDto,
  ): Promise<SectionUser> {
    const section = await this.findOne(id);
    Object.assign(section, updateSectionDto);
    return this.sectionRepository.save(section);
  }

  async remove(id: number): Promise<void> {
    const section = await this.findOne(id);
    await this.sectionRepository.remove(section);
  }
}
