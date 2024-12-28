import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTemplateUserDto } from './dto/create-template-user.dto';
import { UpdateTemplateUserDto } from './dto/update-template-user.dto';
import { templateUser } from './entity/template-user.entity';
import { Template } from '../template/entity/template.entity';
import { Invitation_User } from '../invitation_user/entity/invitation.entity';

@Injectable()
export class TemplateUserService {
  constructor(
    @InjectRepository(templateUser)
    private readonly templateUserRepository: Repository<templateUser>,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(Invitation_User)
    private readonly invitationUserRepository: Repository<Invitation_User>,
  ) { }

  async create(createTemplateDto: CreateTemplateUserDto): Promise<templateUser> {
    const { templateId, ...rest } = createTemplateDto;

    // Kiểm tra template có tồn tại không
    const template = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ['invitation'], // Bao gồm cả invitation liên quan
    });

    if (!template) {
      throw new NotFoundException(`Template with ID "${templateId}" not found`);
    }

    // Tạo template_user
    const templateUser = this.templateUserRepository.create({
      ...rest,
    });

    const savedTemplateUser = await this.templateUserRepository.save(templateUser);

    // Nếu template có invitation, tạo invitation_user tương ứng
    if (template.invitation) {
      const invitationUser = this.invitationUserRepository.create({
        title: template.invitation.title,
        metadata: template.invitation.metadata,
        template_userId: savedTemplateUser.id,
      });

      await this.invitationUserRepository.save(invitationUser);
    }

    return savedTemplateUser;
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
    const [data, total] = await this.templateUserRepository.findAndCount({
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
    const template = await this.templateUserRepository.findOne({
      where: { id },
      relations: ['section_user', 'invitation'],
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

    const [data, total] = await this.templateUserRepository.findAndCount({
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
    return this.templateUserRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);

    await this.templateUserRepository.remove(template);
  }
  async findByLinkName(linkName: string): Promise<templateUser> {
    const template = await this.templateUserRepository.findOne({
      where: { linkName },
      relations: ['section_user', 'invitation'],
    });

    if (!template) {
      throw new NotFoundException(`Template with linkName "${linkName}" not found`);
    }

    return template;
  }

}