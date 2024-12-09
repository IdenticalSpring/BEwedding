// src/template/template.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTemplateUserDto } from './dto/create-template-user.dto';
import { UpdateTemplateUserDto } from './dto/update-template-user.dto';
import { TemplateUser } from './entity/template-user.entity';

@Injectable()
export class TemplateUserService {
  constructor(
    @InjectRepository(TemplateUser)
    private readonly templateRepository: Repository<TemplateUser>,
  ) {}

  async create(createTemplateDto: CreateTemplateUserDto): Promise<TemplateUser> {
    try {

      const template = this.templateRepository.create(createTemplateDto);

      const savedTemplate = await this.templateRepository.save(template);

      return savedTemplate;
    } catch (error) {
      console.error('Lỗi khi lưu template:', error);

      throw new Error('Không thể lưu template: ' + error.message);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 12,
  ): Promise<{ data: TemplateUser[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.templateRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<TemplateUser> {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['sections'],
    });
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }
    return template;
  }


  async update(
    id: string,
    updateTemplateDto: UpdateTemplateUserDto,
  ): Promise<TemplateUser> {
    const template = await this.findOne(id);
    Object.assign(template, updateTemplateDto);
    return this.templateRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);

    await this.templateRepository.remove(template);
  }
  async findByUrl(url: string): Promise<TemplateUser | undefined> {
    return this.templateRepository.findOne({
      where: { url: url },
      relations: ['sections'],
    });
  }
}
