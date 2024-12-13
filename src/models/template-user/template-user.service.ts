// src/template/template.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTemplateUserDto } from './dto/create-template-user.dto';
import { UpdateTemplateUserDto } from './dto/update-template-user.dto';
import { templateUser } from './entity/template-user.entity';

@Injectable()
export class TemplateUserService {
  constructor(
    @InjectRepository(templateUser)
    private readonly templateRepository: Repository<templateUser>,
  ) {}

  async create(
    createTemplateDto: CreateTemplateUserDto,
  ): Promise<templateUser> {
    const template = this.templateRepository.create(createTemplateDto);
    return this.templateRepository.save(template);
  }

  async findAll(
    page: number = 1,
    limit: number = 12,
  ): Promise<{
    data: templateUser[];
    total: number;
    page: number;
    limit: number;
  }> {
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

  async findOne(id: string): Promise<templateUser> {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['section_user'],
    });
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }
    return template;
  }
  async findAllByUserId(
    userId: number | string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: templateUser[];
    total: number;
    page: number;
    limit: number;
  }> {
    const numericUserId =
      typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const [data, total] = await this.templateRepository.findAndCount({
      where: { user: { id: numericUserId } },
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

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateUserDto,
  ): Promise<templateUser> {
    const template = await this.findOne(id);
    Object.assign(template, updateTemplateDto);
    return this.templateRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);

    await this.templateRepository.remove(template);
  }
}
