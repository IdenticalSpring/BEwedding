import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Theme } from './entity/theme.entity';
import { Template } from '../template/entity/template.entity';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) { }

  // Create a new theme with a specific template
  async create(createThemeDto: CreateThemeDto) {
    const template = await this.templateRepository.findOne({
      where: { id: createThemeDto.templateId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${createThemeDto.templateId} not found`);
    }

    const theme = this.themeRepository.create(createThemeDto);
    theme.template = template;  
    return await this.themeRepository.save(theme); 
  }


  // Retrieve all themes with pagination
  async findAll(page: number, limit: number) {
    const [themes, total] = await this.themeRepository.findAndCount({
      relations: ['template'], // Include the related template information
      skip: (page - 1) * limit, // Skip the records for pagination
      take: limit, // Limit the number of records returned
    });

    return {
      data: themes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit), // Calculate the total number of pages
    };
  }

  // Retrieve a specific theme by ID with related data and pagination
  async findOne(id: string) {
    const theme = await this.themeRepository.findOne({
      where: { id },
      relations: ['template'], // Tìm theme với thông tin template liên quan
    });

    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }

    return theme; // Trả về theme tìm được
  }



  // Update an existing theme
  async update(id: string, updateThemeDto: UpdateThemeDto) {
    const theme = await this.themeRepository.findOne({
      where: { id },
    });

    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }

    // Update the theme with the new data from the DTO
    Object.assign(theme, updateThemeDto);
    return await this.themeRepository.save(theme); // Save the updated theme
  }

  // Remove a theme by its ID
  async remove(id: string) {
    const theme = await this.themeRepository.findOne({
      where: { id },
    });

    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }

    await this.themeRepository.remove(theme); 
  }

}
