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
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Guestbook Section')
@Controller('guestbook-section')
@ApiBearerAuth('JWT')
export class GuestbookSectionController {
  constructor(
    private readonly guestbookSectionService: GuestbookSectionService,
  ) {}

  @Post()
  @Public()
  async create(@Body() createGuestbookSectionDto: CreateGuestbookSectionDto) {
    return this.guestbookSectionService.create(createGuestbookSectionDto);
  }

  @Get()
  @Public()
  async findAll() {
    return this.guestbookSectionService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.guestbookSectionService.findOne(id);
  }

  @Put(':id')
  @Public()
  async update(
    @Param('id') id: string,
    @Body() updateGuestbookSectionDto: UpdateGuestbookSectionDto,
  ) {
    return this.guestbookSectionService.update(id, updateGuestbookSectionDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    return this.guestbookSectionService.remove(id);
  }
}
