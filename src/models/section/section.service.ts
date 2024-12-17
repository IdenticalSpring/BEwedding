import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entity/section.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const section = this.sectionRepository.create(createSectionDto);
    return this.sectionRepository.save(section);
  }

  async findAll(): Promise<Section[]> {
    return this.sectionRepository.find();
  }
  async findByTemplateId(templateId: string): Promise<Section[]> {
    return this.sectionRepository.find({ where: { templateId } });
  }

  async findOne(id: string): Promise<Section> {
    const section = await this.sectionRepository.findOne({ where: { id } });
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

  async update(
    id: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    const section = await this.findOne(id);
    Object.assign(section, updateSectionDto);
    return this.sectionRepository.save(section);
  }

  async remove(id: string): Promise<void> {
    const section = await this.findOne(id);
    await this.sectionRepository.remove(section);
  }
}
