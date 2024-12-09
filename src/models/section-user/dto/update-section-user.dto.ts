import { PartialType } from '@nestjs/swagger';
import { CreateSectionUserDto } from './create-section-user.dto';

export class UpdateSectionUserDto extends PartialType(CreateSectionUserDto) {}
