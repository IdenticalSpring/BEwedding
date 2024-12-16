import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlan } from './entity/subscription-plan.entity'; 
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@ApiTags('Subscription Plans')
@Controller('subscription-plans')
@ApiBearerAuth('JWT')
export class SubscriptionPlanController {
    constructor(private readonly subscriptionPlanService: SubscriptionPlanService) { }

    @Get()
    @ApiOperation({ summary: 'Get all subscription plans' })
    @ApiResponse({ status: 200, description: 'List of subscription plans.' })
    async findAll(): Promise<SubscriptionPlan[]> {
        return await this.subscriptionPlanService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'Subscription plan found.' })
    async findById(@Param('id', ParseIntPipe) id: number): Promise<SubscriptionPlan> {
        return await this.subscriptionPlanService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new subscription plan' })
    @ApiResponse({ status: 201, description: 'Subscription plan created.' })
    async create(@Body() createDto: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> {
        return await this.subscriptionPlanService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'Subscription plan updated.' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateSubscriptionPlanDto,
    ): Promise<SubscriptionPlan> {
        return await this.subscriptionPlanService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'Subscription plan deleted.' })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        await this.subscriptionPlanService.delete(id);
        return { message: `Subscription Plan with ID ${id} has been deleted` };
    }
}
