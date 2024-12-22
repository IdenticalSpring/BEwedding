import { Controller, Post, Body, Param, Delete, Query, Req, BadRequestException, Patch, Get, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto'; 
import { Request } from 'express';
import { PayOSWebhookDto } from './dto/webhook.dto';
import { UpdateSubscriptionDto } from './dto/update-subcription.dto';
import { Subscription } from './entity/subscription.entity';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@ApiBearerAuth('JWT')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Post('create')
    @ApiOperation({ summary: 'Create or update a subscription and generate a payment link' })
    @ApiResponse({ status: 201, description: 'Subscription created or updated successfully' })
    @ApiResponse({ status: 200, description: 'Subscription already exists or updated with confirmation' })
    async createOrUpdateSubscription(
        @Body() createSubscriptionDto: CreateSubscriptionDto,
    ): Promise<{ message?: string; paymentUrl?: string }> {
        const { userId, planId, confirmChange } = createSubscriptionDto;

        // Call the service with the provided details
        return this.subscriptionService.createSubscription(userId, planId, confirmChange);
    }

    @Patch('update-status')
    @ApiOperation({ summary: 'Update subscription status' })
    @ApiResponse({ status: 200, description: 'Subscription status updated successfully' })
    @ApiResponse({ status: 404, description: 'Subscription not found' })
    async updateStatus(@Body() updateSubscriptionDto: UpdateSubscriptionDto): Promise<void> {
        const { orderCode, success, startDate, endDate } = updateSubscriptionDto;

        if (!orderCode || success === undefined) {
            throw new BadRequestException('OrderCode and success status are required');
        }

        await this.subscriptionService.updateSubscriptionStatus(orderCode, success, startDate, endDate);
    }

    @Get('user/:userId/valid-subscription')
    @ApiOperation({ summary: 'Check if user has a valid subscription' })
    @ApiResponse({ status: 200, description: 'Returns true or false based on subscription validity' })
    async checkUserSubscription(
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<{ hasValidSubscription: boolean }> {
        const isValid = await this.subscriptionService.hasValidSubscription(userId);
        return { hasValidSubscription: isValid };
    }


}
