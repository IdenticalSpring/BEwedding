import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestList } from './entity/guest.entity';
import { CreateGuestListDto } from './dto/create-guest.dto';
import { UpdateGuestListDto } from './dto/update-guest.dto';

@Injectable()
export class GuestListService {
  constructor(
    @InjectRepository(GuestList)
    private readonly guestListRepository: Repository<GuestList>,
  ) {}

  async create(createGuestListDto: CreateGuestListDto) {
    const guest = this.guestListRepository.create(createGuestListDto);
    return this.guestListRepository.save(guest);
  }

  async findAll(weddingId: string, page: number, limit: number) {
    // Tìm kiếm khách mời theo weddingId và phân trang
    const [guests, total] = await this.guestListRepository.findAndCount({
      where: { weddingId },
      skip: (page - 1) * limit, // Tính toán offset
      take: limit, // Lấy số lượng khách mời theo limit
      relations: ['templateUser'], // Fetch related weddingDetail
    });

    return {
      guests, // Danh sách khách mời
      total, // Tổng số khách mời
      page, // Trang hiện tại
      limit, // Số lượng khách mời trên mỗi trang
      totalPages: Math.ceil(total / limit), // Tổng số trang
    };
  }

  async findOne(id: string) {
    return this.guestListRepository.findOneBy({ id });
  }

  async update(id: string, updateGuestListDto: UpdateGuestListDto) {
    await this.guestListRepository.update(id, updateGuestListDto);
    return this.guestListRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const guest = await this.findOne(id);
    return this.guestListRepository.remove(guest);
  }
}
