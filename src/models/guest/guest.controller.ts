import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GuestListService } from './guest.service';
import { CreateGuestListDto } from './dto/create-guest.dto';
import { UpdateGuestListDto } from './dto/update-guest.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('GuestList')
@Controller('guest-list')
@ApiBearerAuth('JWT')
export class GuestListController {
  constructor(private readonly guestListService: GuestListService) {}

  @Public()
  @Post()
  async create(@Body() createGuestListDto: CreateGuestListDto) {
    return this.guestListService.create(createGuestListDto);
  }

  @Public()
  @Get()
  // @ApiQuery({
  //   name: 'weddingId',
  //   description: 'ID of the wedding to filter guests',
  // })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10,
  })
  async findAll(
    // @Query('weddingId') weddingId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Math.min(100, Number(limit))); // Giới hạn tối đa 100
    return this.guestListService.findAll(pageNumber, limitNumber);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.guestListService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGuestListDto: UpdateGuestListDto,
  ) {
    return this.guestListService.update(id, updateGuestListDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.guestListService.remove(id);
  }
}
