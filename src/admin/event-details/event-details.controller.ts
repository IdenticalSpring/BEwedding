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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EventDetailService } from 'src/models/event-details/event-details.service';
import { CreateEventDetailDTO } from 'src/models/event-details/dto/create-event-details.dto';
import { EventDetail } from 'src/models/event-details/entity/event-details.entity';
import { UpdateEventDetailDTO } from 'src/models/event-details/dto/update-event-details.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';

@ApiTags('admin/Event Details')
@Controller('admin/event-details')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminEventDetailController {
  constructor(private readonly eventDetailService: EventDetailService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new event detail' })
  @ApiResponse({
    status: 201,
    description: 'The event detail has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createEventDetailDTO: CreateEventDetailDTO,
  ): Promise<EventDetail> {
    return this.eventDetailService.create(createEventDetailDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an event detail by id' })
  @ApiResponse({ status: 200, description: 'Return the event detail' })
  @ApiResponse({ status: 404, description: 'Event detail not found' })
  async findOne(@Param('id') id: string): Promise<EventDetail> {
    return this.eventDetailService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all event details' })
  @ApiResponse({ status: 200, description: 'Return all event details' })
  async findAll(): Promise<EventDetail[]> {
    return this.eventDetailService.findAll();
  }

  @Get('wedding/:weddingID')
  @ApiOperation({ summary: 'Get event details by wedding ID' })
  @ApiResponse({
    status: 200,
    description: 'Return event details filtered by wedding ID',
  })
  @ApiResponse({
    status: 404,
    description: 'No event details found for the given wedding ID',
  })
  async findByWeddingID(
    @Param('weddingID') weddingId: string,
  ): Promise<EventDetail[]> {
    return this.eventDetailService.findByWeddingID(weddingId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an event detail by id' })
  @ApiResponse({
    status: 200,
    description: 'The event detail has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Event detail not found' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDetailDTO: UpdateEventDetailDTO,
  ): Promise<EventDetail> {
    return this.eventDetailService.update(id, updateEventDetailDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event detail by id' })
  @ApiResponse({
    status: 200,
    description: 'The event detail has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Event detail not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventDetailService.remove(id);
  }
}
