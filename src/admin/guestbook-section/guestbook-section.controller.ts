import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GuestbookSectionService } from 'src/models/guestbook-section/guestbook-section.service';
import { CreateGuestbookSectionDto } from 'src/models/guestbook-section/dto/create-guestbook-section.dto';
import { UpdateGuestbookSectionDto } from 'src/models/guestbook-section/dto/update-guestbook-section.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';

@ApiTags('admin/Guestbook Section')
@Controller('admin/guestbook-section')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
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
