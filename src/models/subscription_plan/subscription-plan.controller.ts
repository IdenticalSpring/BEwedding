import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlan } from './entity/subscription-plan.entity'; 
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Subscription Plans')
@Controller('subscription-plans')
@ApiBearerAuth('JWT')
@Public()
export class SubscriptionPlanController {
    constructor(private readonly subscriptionPlanService: SubscriptionPlanService) { }

    @Get()
    @Public()
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

   
}
