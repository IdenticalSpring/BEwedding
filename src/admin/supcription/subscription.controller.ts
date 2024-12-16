import { Controller, Post, Body, Param, Delete, Query, Req, BadRequestException, Patch, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubscriptionService } from 'src/models/subscription/subscription.service'; 
import { CreateSubscriptionDto } from 'src/models/subscription/dto/create-subscription.dto'; 
import { UpdateSubscriptionDto } from 'src/models/subscription/dto/update-subcription.dto'; 
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PaginationQueryDto } from 'src/models/subscription/dto/paginated.dto';

@ApiTags('admin/Subscriptions')
@Controller('admin/subscriptions')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminSubscriptionController{
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
    @Get()
    @ApiOperation({ summary: 'Get all subscriptions with pagination' })
    @ApiResponse({ status: 200, description: 'List of subscriptions with pagination metadata' })
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of items per page' })
    async getAllSubscriptions(
        @Query() { page, limit }: PaginationQueryDto,
    ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
        const { data, total } = await this.subscriptionService.getSubscriptions(page, limit);

        return {
            data,
            total,
            page,
            limit,
        };
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a subscription by ID' })
    @ApiResponse({ status: 200, description: 'Subscription deleted successfully' })
    @ApiResponse({ status: 404, description: 'Subscription not found' })
    async deleteSubscription(@Param('id') id: number): Promise<{ message: string }> {
        return this.subscriptionService.deleteSubscription(id);
    }
}
