// src/wedding-details/dto/update-wedding-detail.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateWeddingDetailDto } from './create-wedding-details.dto';

export class UpdateWeddingDetailDto extends PartialType(
  CreateWeddingDetailDto,
) {}
