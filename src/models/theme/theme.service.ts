import { Injectable } from '@nestjs/common';
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
      throw new Error('Template not found'); // Throw error if template does not exist
    }

    const theme = this.themeRepository.create(createThemeDto); // Create a theme from the DTO
    theme.template = template; // Associate the theme with the template
    return this.themeRepository.save(theme); // Save the theme to the database
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
  async findOne(id: string, page: number, limit: number) {
    const theme = await this.themeRepository.findOne({
      where: { id },
      relations: ['template'], // Include related template data
    });

    if (!theme) {
      throw new Error('Theme not found'); // Throw error if the theme does not exist
    }

    // Fetch related templates (assuming a theme can have related templates)
    const [relatedData, total] = await this.templateRepository.findAndCount({
      where: { theme: { id } }, // Find templates related to the theme
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      theme, // The main theme data
      relatedData, // Paginated related templates
      total, // Total count of related templates
      page,
      limit,
      totalPages: Math.ceil(total / limit), // Calculate the total number of pages for related data
    };
  }

  // Update an existing theme
  async update(id: string, updateThemeDto: UpdateThemeDto) {
    const theme = await this.themeRepository.findOne({
      where: { id },
    });

    if (!theme) {
      throw new Error('Theme not found'); // Throw error if the theme does not exist
    }

    // Update the theme with the new data from the DTO
    Object.assign(theme, updateThemeDto);
    return this.themeRepository.save(theme); // Save the updated theme
  }

  // Remove a theme by its ID
  async remove(id: string) {
    const theme = await this.themeRepository.findOne({
      where: { id },
    });

    if (!theme) {
      throw new Error('Theme not found'); // Throw error if the theme does not exist
    }

    await this.themeRepository.remove(theme); // Remove the theme from the database
  }
}
