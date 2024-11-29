import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventDetail } from './entity/event-details.entity';
import { WeddingDetail } from '../wedding-details/enitity/wedding-details.enity';
import { CreateEventDetailDTO } from './dto/create-event-details.dto';
import { UpdateEventDetailDTO } from './dto/update-event-details.dto';

@Injectable()
export class EventDetailService {
  constructor(
    @InjectRepository(EventDetail)
    private readonly eventDetailRepository: Repository<EventDetail>,
    @InjectRepository(WeddingDetail)
    private readonly weddingDetailRepository: Repository<WeddingDetail>,
  ) {}

  // Tạo mới EventDetail
  async create(createEventDetailDto: CreateEventDetailDTO) {
    const weddingDetail = await this.weddingDetailRepository.findOne({
      where: { id: createEventDetailDto.weddingId },
    });

    if (!weddingDetail) {
      throw new Error('Wedding details not found');
    }

    const eventDetail = this.eventDetailRepository.create(createEventDetailDto);
    eventDetail.weddingDetail = weddingDetail;
    return this.eventDetailRepository.save(eventDetail);
  }

  // Lấy tất cả EventDetails
  async findAll() {
    return this.eventDetailRepository.find({ relations: ['weddingDetail'] });
  }

  // Lấy EventDetail theo ID
  async findOne(id: string) {
    return this.eventDetailRepository.findOne({
      where: { id },
      relations: ['weddingDetail'],
    });
  }

  // Cập nhật EventDetail
  async update(id: string, updateEventDetailDto: UpdateEventDetailDTO) {
    const eventDetail = await this.eventDetailRepository.findOne({
      where: { id },
    });

    if (!eventDetail) {
      throw new Error('EventDetail not found');
    }

    Object.assign(eventDetail, updateEventDetailDto);
    return this.eventDetailRepository.save(eventDetail);
  }

  // Xóa EventDetail
  async remove(id: string) {
    const eventDetail = await this.eventDetailRepository.findOne({
      where: { id },
    });

    if (!eventDetail) {
      throw new Error('EventDetail not found');
    }

    await this.eventDetailRepository.remove(eventDetail);
  }
}
