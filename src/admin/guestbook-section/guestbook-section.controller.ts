import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { GuestbookSectionService } from 'src/models/guestbook-section/guestbook-section.service';
import { CreateGuestbookSectionDto } from 'src/models/guestbook-section/dto/create-guestbook-section.dto';
import { UpdateGuestbookSectionDto } from 'src/models/guestbook-section/dto/update-guestbook-section.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('admin/Guestbook Section')
@Controller('admin/guestbook-section')
@ApiBearerAuth('JWT')
@Roles('admin')
export class AdminGuestbookSectionController {
  constructor(
    private readonly guestbookSectionService: GuestbookSectionService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new guestbook section' })
  @ApiResponse({
    status: 201,
    description: 'The guestbook section has been successfully created.',
  })
  async create(@Body() createGuestbookSectionDto: CreateGuestbookSectionDto) {
    return this.guestbookSectionService.create(createGuestbookSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all guestbook sections' })
  @ApiResponse({ status: 200, description: 'Return all guestbook sections' })
  async findAll() {
    return this.guestbookSectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a guestbook section by ID' })
  @ApiResponse({ status: 200, description: 'Return the guestbook section' })
  @ApiResponse({ status: 404, description: 'Guestbook section not found' })
  async findOne(@Param('id') id: string) {
    return this.guestbookSectionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a guestbook section by ID' })
  @ApiResponse({
    status: 200,
    description: 'The guestbook section has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Guestbook section not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGuestbookSectionDto: UpdateGuestbookSectionDto,
  ) {
    return this.guestbookSectionService.update(id, updateGuestbookSectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a guestbook section by ID' })
  @ApiResponse({
    status: 200,
    description: 'The guestbook section has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Guestbook section not found' })
  async remove(@Param('id') id: string) {
    return this.guestbookSectionService.remove(id);
  }
}