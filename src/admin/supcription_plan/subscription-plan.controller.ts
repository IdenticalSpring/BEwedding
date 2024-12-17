import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionPlanService } from 'src/models/subscription_plan/subscription-plan.service'; 
import { SubscriptionPlan } from 'src/models/subscription_plan/entity/subscription-plan.entity'; 
import { CreateSubscriptionPlanDto } from 'src/models/subscription_plan/dto/create-subscription-plan.dto'; 
import { UpdateSubscriptionPlanDto } from 'src/models/subscription_plan/dto/update-subscription-plan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('admin/Subscription Plans')
@Controller('admin/subscription-plans')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminSubscriptionPlanController {
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
    @Get('Paginated')
    @ApiOperation({ summary: 'Get all subscription plans with pagination' })
    @ApiResponse({ status: 200, description: 'List of subscription plans.' })
    async findAllPaginated(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,
    ): Promise<{ data: SubscriptionPlan[]; total: number; currentPage: number }> {
        return await this.subscriptionPlanService.findAllPaginated(page, limit);
    }
}
