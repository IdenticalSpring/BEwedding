import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { GuestbookSectionService } from './guestbook-section.service';
import { CreateGuestbookSectionDto } from './dto/create-guestbook-section.dto';
import { UpdateGuestbookSectionDto } from './dto/update-guestbook-section.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Guestbook Section')
@Controller('guestbook-section')
@ApiBearerAuth('JWT')
export class GuestbookSectionController {
  constructor(
    private readonly guestbookSectionService: GuestbookSectionService,
  ) {}

  @Post()
  async create(@Body() createGuestbookSectionDto: CreateGuestbookSectionDto) {
    return this.guestbookSectionService.create(createGuestbookSectionDto);
  }

  @Get()
  async findAll() {
    return this.guestbookSectionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.guestbookSectionService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGuestbookSectionDto: UpdateGuestbookSectionDto,
  ) {
    return this.guestbookSectionService.update(id, updateGuestbookSectionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.guestbookSectionService.remove(id);
  }
}
