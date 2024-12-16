import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entity/subscription.entity';
import { SubscriptionPlan } from 'src/models/subscription_plan/entity/subscription-plan.entity';
import { User } from 'src/models/user/entity/user.entity';
import { PayOSService } from './payos.service'; 
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class SubscriptionService {
    private readonly frontendUrl: string;
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(SubscriptionPlan)
        private readonly planRepository: Repository<SubscriptionPlan>,
        private readonly payOSService: PayOSService,
        private readonly configService: ConfigService,
    ) { this.frontendUrl = this.configService.get<string>('FRONTEND_URL');

     }



    private async generateUniqueOrderCode(): Promise<number> {
        let orderCode: number;
        let isUnique = false;

        while (!isUnique) {
            
            orderCode = Math.floor(100000 + Math.random() * 900000);

            const existingSubscription = await this.subscriptionRepository.findOne({
                where: { orderCode },
            });

            if (!existingSubscription) {
                isUnique = true; 
            }
        }

        return orderCode;
    }

    async createSubscription(userId: number, planId: number, confirmChange = false): Promise<{ message?: string; paymentUrl?: string }> {
        const logger = new Logger('SubscriptionService');

        // 1. Kiểm tra User
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

        // 2. Kiểm tra Subscription hiện tại của User
        const existingSubscription = await this.subscriptionRepository.findOne({
            where: { user: { id: userId } },
            relations: ['subscriptionPlan'],
        });

        if (existingSubscription) {
            // Nếu User đã có Subscription
            if (existingSubscription.subscriptionPlan.id === planId) {
                // Nếu Subscription hiện tại trùng với planId
                if (existingSubscription.status === SubscriptionStatus.ACTIVE) {
                    return { message: 'Bạn đã mua gói này rồi.' };
                } else {
                    return { paymentUrl: existingSubscription.paymentLinkId }; // Trả về link thanh toán cũ
                }
            } else {
                // Nếu Subscription hiện tại khác planId
                if (existingSubscription.status === SubscriptionStatus.ACTIVE && !confirmChange) {
                    // Nếu Subscription cũ đang ACTIVE và chưa xác nhận, yêu cầu xác nhận
                    return { message: 'Bạn đã có gói hiện tại đang ACTIVE. Xác nhận để thay đổi gói.' };
                }

                // Xóa Subscription cũ nếu đã được xác nhận
                await this.subscriptionRepository.remove(existingSubscription);
            }
        }

        // 3. Kiểm tra Plan
        const plan = await this.planRepository.findOne({ where: { id: planId } });
        if (!plan) throw new NotFoundException(`Subscription Plan với ID ${planId} không tồn tại`);

        // 4. Tạo orderCode không trùng
        const orderCode = await this.generateUniqueOrderCode();

        // 5. Tạo Subscription mới
        const subscription = this.subscriptionRepository.create({
            user,
            subscriptionPlan: plan,
            amount: plan.price,
            status: SubscriptionStatus.PENDING,
            orderCode,
        });

        const savedSubscription = await this.subscriptionRepository.save(subscription);

        // 6. Chuẩn bị dữ liệu gửi tới PayOS
        const paymentData = {
            orderCode: orderCode, // Sử dụng orderCode đã tạo
            amount: Number(plan.price),
            description: `Subscription for plan: ${plan.name}`.slice(0, 25),
            returnUrl: `${this.frontendUrl}/payment-success`,
            cancelUrl: `${this.frontendUrl}/payment-cancel`,
            items: [
                {
                    name: plan.name.slice(0, 25),
                    quantity: 1,
                    price: Number(plan.price),
                },
            ],
        };

        logger.debug('Data sent to PayOS:');
        console.log(paymentData);

        // 7. Gửi yêu cầu tạo Payment Link
        const paymentUrl = await this.payOSService.createPaymentLink(paymentData);

        // 8. Cập nhật paymentLinkId
        savedSubscription.paymentLinkId = paymentUrl;
        await this.subscriptionRepository.save(savedSubscription);

        return { paymentUrl };
    }




    async updateSubscriptionStatus(
        orderCode: number,
        success: boolean,
        startDate?: Date,
        endDate?: Date,
    ): Promise<void> {
        const subscription = await this.subscriptionRepository.findOne({
            where: { orderCode },
            relations: ['subscriptionPlan'], // Lấy thông tin gói subscription
        });

        if (!subscription) {
            throw new NotFoundException(`Subscription with OrderCode ${orderCode} not found`);
        }

        if (success) {
            subscription.status = SubscriptionStatus.ACTIVE;
            subscription.startDate = startDate || new Date();

            if (!endDate) {
                const durationMonths = subscription.subscriptionPlan?.duration || 1; 
                const start = subscription.startDate || new Date();
                subscription.endDate = new Date(start.setMonth(start.getMonth() + durationMonths));
            } else {
                subscription.endDate = endDate;
            }
        } else {
            subscription.status = SubscriptionStatus.FAILED;
        }

        await this.subscriptionRepository.save(subscription);
    }




    async getSubscriptions(page: number, limit: number): Promise<{ data: Subscription[]; total: number }> {
        const [data, total] = await this.subscriptionRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: ['user', 'subscriptionPlan'], 
            order: { createdAt: 'DESC' }, 
        });

        return { data, total };
    }
    async deleteSubscription(id: number): Promise<{ message: string }> {
        const subscription = await this.subscriptionRepository.findOne({ where: { id } });

        if (!subscription) {
            throw new NotFoundException(`Subscription with ID ${id} not found`);
        }

        // Delete the subscription
        await this.subscriptionRepository.delete(id);

        return { message: `Subscription with ID ${id} has been deleted successfully.` };
    }

}
