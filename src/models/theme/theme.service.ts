import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Theme } from './entity/theme.enity';
import { Template } from '../template/entity/template.entity';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  async create(createThemeDto: CreateThemeDto) {
    const template = await this.templateRepository.findOne({
      where: { id: createThemeDto.templateId },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    const theme = this.themeRepository.create(createThemeDto);
    theme.template = template;
    return this.themeRepository.save(theme);
  }

  async findAll(page: number, limit: number) {
    const [themes, total] = await this.themeRepository.findAndCount({
      relations: ['template'], // Fetch related templates
      skip: (page - 1) * limit, // Số bản ghi cần bỏ qua
      take: limit, // Số bản ghi cần lấy
    });

    return {
      data: themes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, page: number, limit: number) {
    const theme = await this.themeRepository.findOne({
      where: { id },
      relations: ['template'], // Liên kết với bảng template
    });

    if (!theme) {
      throw new Error('Theme not found');
    }

    // Lấy danh sách liên quan (nếu cần phân trang cho một mối quan hệ cụ thể)
    const [relatedData, total] = await this.templateRepository.findAndCount({
      where: { theme: { id } }, // Giả sử template có mối quan hệ với theme
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      theme, // Thông tin chính của theme
      relatedData, // Dữ liệu liên quan đã phân trang
      total, // Tổng số mục liên quan
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateThemeDto: UpdateThemeDto) {
    const theme = await this.themeRepository.findOne({
      where: { id },
    });

    if (!theme) {
      throw new Error('Theme not found');
    }

    Object.assign(theme, updateThemeDto);
    return this.themeRepository.save(theme);
  }

  async remove(id: string) {
    const theme = await this.themeRepository.findOne({
      where: { id },
    });

    if (!theme) {
      throw new Error('Theme not found');
    }

    await this.themeRepository.remove(theme);
  }
}
