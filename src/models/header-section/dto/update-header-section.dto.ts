import { PartialType } from '@nestjs/mapped-types';
import { CreateHeaderSectionDto } from './create-header-section.dto';

export class UpdateHeaderSectionDto extends PartialType(
  CreateHeaderSectionDto,
) {}
