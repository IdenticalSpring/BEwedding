// src/event-details/event-detail.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EventDetailService } from './event-details.service';
import { CreateEventDetailDTO } from './dto/create-event-details.dto';
import { EventDetail } from './entity/event-details.entity';
import { UpdateEventDetailDTO } from './dto/update-event-details.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Event Details')
@Controller('event-details')
@ApiBearerAuth('JWT')
export class EventDetailController {
  constructor(private readonly eventDetailService: EventDetailService) {}

  @Post()
  @Public()
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
  @Public()
  @ApiOperation({ summary: 'Get an event detail by id' })
  @ApiResponse({ status: 200, description: 'Return the event detail' })
  @ApiResponse({ status: 404, description: 'Event detail not found' })
  async findOne(@Param('id') id: string): Promise<EventDetail> {
    return this.eventDetailService.findOne(id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all event details' })
  @ApiResponse({ status: 200, description: 'Return all event details' })
  async findAll(): Promise<EventDetail[]> {
    return this.eventDetailService.findAll();
  }
  @Get('wedding/:weddingID')
  @Public()
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
  @Public()
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
  @Public()
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
