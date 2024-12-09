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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Guestbook Section')
@Controller('guestbook-section')
@ApiBearerAuth('JWT')
export class GuestbookSectionController {
  constructor(
    private readonly guestbookSectionService: GuestbookSectionService,
  ) {}

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
    const guestbookSection = await this.guestbookSectionService.findOne(id);
    if (!guestbookSection) {
      throw new Error('Guestbook section not found');
    }
    return guestbookSection;
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
    const guestbookSection = await this.guestbookSectionService.update(
      id,
      updateGuestbookSectionDto,
    );
    if (!guestbookSection) {
      throw new Error('Guestbook section not found');
    }
    return guestbookSection;
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
