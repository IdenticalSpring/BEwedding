// src/template/template.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './entity/template.entity';
import { SubscriptionPlan } from '../subscription_plan/entity/subscription-plan.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    // Kiểm tra subscriptionPlanId
    let subscriptionPlan = null;
    if (createTemplateDto.subscriptionPlanId) {
      subscriptionPlan = await this.templateRepository.manager.findOne(SubscriptionPlan, {
        where: { id: createTemplateDto.subscriptionPlanId },
      });

      if (!subscriptionPlan) {
        throw new NotFoundException(`Subscription Plan với ID "${createTemplateDto.subscriptionPlanId}" không tồn tại.`);
      }
    }

    // Tạo template
    const template = this.templateRepository.create({
      ...createTemplateDto,
      subscriptionPlan, 
    });

    return this.templateRepository.save(template);
  }
  async findAll(
    page: number = 1,
    limit: number = 12,
  ): Promise<{ data: Template[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.templateRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['subscriptionPlan'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Template> {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['sections' ,'subscriptionPlan'],
    });
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }
    return template;
  }


  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template> {
    const template = await this.findOne(id);

    // Xử lý cập nhật subscriptionPlan
    if (updateTemplateDto.subscriptionPlanId !== undefined) {
      const subscriptionPlan = await this.templateRepository.manager.findOne(SubscriptionPlan, {
        where: { id: updateTemplateDto.subscriptionPlanId },
      });

      if (!subscriptionPlan) {
        throw new NotFoundException(
          `Subscription Plan với ID "${updateTemplateDto.subscriptionPlanId}" không tồn tại.`,
        );
      }

      template.subscriptionPlan = subscriptionPlan;
    }

    // Cập nhật các trường còn lại
    Object.assign(template, updateTemplateDto);

    return this.templateRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);

    await this.templateRepository.remove(template);
  }
}
