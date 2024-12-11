// src/template/dto/update-template.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateUserDto } from './create-template-user.dto';

export class UpdateTemplateUserDto extends PartialType(CreateTemplateUserDto) {}
