import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GuestListService } from 'src/models/guest/guest.service';
import { CreateGuestListDto } from 'src/models/guest/dto/create-guest.dto';
import { UpdateGuestListDto } from 'src/models/guest/dto/update-guest.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';

@ApiTags('admin/GuestList')
@Controller('admin/guest-list')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminGuestListController {
  constructor(private readonly guestListService: GuestListService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new guest list entry' })
  @ApiResponse({
    status: 201,
    description: 'The guest list entry has been successfully created.',
  })
  async create(@Body() createGuestListDto: CreateGuestListDto) {
    return this.guestListService.create(createGuestListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all guest list entries' })
  @ApiQuery({
    name: 'weddingId',
    description: 'ID of the wedding to filter guests',
  })
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
  @ApiResponse({ status: 200, description: 'Return a list of guest list entries' })
  async findAll(
    @Query('weddingId') weddingId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Math.min(100, Number(limit)));

    // Kiểm tra weddingId nếu cần
    if (!weddingId) {
      throw new HttpException('Wedding ID is required', HttpStatus.BAD_REQUEST);
    }

    return this.guestListService.findAll(weddingId, pageNumber, limitNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a guest list entry by ID' })
  @ApiResponse({ status: 200, description: 'Return the guest list entry' })
  @ApiResponse({ status: 404, description: 'Guest list entry not found' })
  async findOne(@Param('id') id: string) {
    const guest = await this.guestListService.findOne(id);
    if (!guest) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return guest;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a guest list entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'The guest list entry has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Guest list entry not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGuestListDto: UpdateGuestListDto,
  ) {
    const updatedGuest = await this.guestListService.update(id, updateGuestListDto);
    if (!updatedGuest) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return updatedGuest;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a guest list entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'The guest list entry has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Guest list entry not found' })
  async remove(@Param('id') id: string) {
    const guest = await this.guestListService.remove(id);
    if (!guest) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return; 
  }
}
