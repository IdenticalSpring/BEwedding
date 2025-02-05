// src/wedding-details/wedding-detail.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeddingDetail } from './entity/wedding-details.entity';
import { CreateWeddingDetailDto } from './dto/create-wedding-details.dto';
import { UpdateWeddingDetailDto } from './dto/update-wedding-details.dto';

@Injectable()
export class WeddingDetailService {
  constructor(
    @InjectRepository(WeddingDetail)
    private weddingDetailRepository: Repository<WeddingDetail>,
  ) {}

  create(createDto: CreateWeddingDetailDto) {
    const weddingDetail = this.weddingDetailRepository.create(createDto);
    return this.weddingDetailRepository.save(weddingDetail);
  }

  async findAll(): Promise<WeddingDetail[]> {
    return this.weddingDetailRepository.find({
      relations: ['templateUser'], // Gắn quan hệ để truy xuất templateUser nếu cần
    });
  }

  async findAllByUserId(userId: number): Promise<WeddingDetail[]> {
    return this.weddingDetailRepository.find({
      relations: ['templateUser'], // Gắn quan hệ để truy xuất thông tin userId
      where: {
        templateUser: { userId }, // Điều kiện tìm kiếm dựa trên userId
      },
    });
  }

  async findOne(id: string) {
    const weddingDetail = await this.weddingDetailRepository.findOne({
      where: { id },
    });
    if (!weddingDetail) {
      throw new NotFoundException(`Wedding detail with ID ${id} not found`);
    }
    return weddingDetail;
  }

  async update(id: string, updateDto: UpdateWeddingDetailDto) {
    const weddingDetail = await this.weddingDetailRepository.preload({
      id,
      ...updateDto,
    });
    if (!weddingDetail) {
      throw new NotFoundException(`Wedding detail with ID ${id} not found`);
    }
    return this.weddingDetailRepository.save(weddingDetail);
  }

  async remove(id: string) {
    const weddingDetail = await this.findOne(id);
    return this.weddingDetailRepository.remove(weddingDetail);
  }
  async findById(id: string): Promise<WeddingDetail | null> {
    return this.weddingDetailRepository.findOne({
      where: { id },
    });
  }
}
