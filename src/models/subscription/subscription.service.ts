import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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


    async createSubscription(userId: number, planId: number, confirmChange = false): Promise<{ statusCode: number; message: string; paymentUrl?: string }> {
        const logger = new Logger('SubscriptionService');

        // 1. Kiểm tra User
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return { statusCode: HttpStatus.NOT_FOUND, message: `User with ID ${userId} not found` };
        }

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
                    return { statusCode: HttpStatus.CONFLICT, message: 'Bạn đã thanh toán cho gói này rồi.' };
                } else if (existingSubscription.status === SubscriptionStatus.PENDING) {
                    // Nếu đang ở trạng thái PENDING, trả lại paymentUrl
                    return { statusCode: HttpStatus.NO_CONTENT, message: 'Chưa thanh toán. Trả về link thanh toán.', paymentUrl: existingSubscription.paymentLinkId };
                } else if (existingSubscription.status === SubscriptionStatus.FAILED) {
                    // Nếu trạng thái FAILED, xóa subscription cũ và tạo mới
                    await this.deleteSubscription(existingSubscription.id); // Xóa subscription cũ
                    return await this.createPaymentLinkAndUpdateSubscription(userId, planId); // Tạo mới
                }
            } else {
                // Nếu Subscription hiện tại khác planId
                if (existingSubscription.status === SubscriptionStatus.ACTIVE && !confirmChange) {
                    return { statusCode: HttpStatus.ACCEPTED, message: 'Bạn đã có gói hiện tại đang ACTIVE. Xác nhận để thay đổi gói.' };
                }

                // Xóa Subscription cũ nếu đã được xác nhận
                await this.subscriptionRepository.remove(existingSubscription);
            }
        }

        // 3. Kiểm tra Plan
        const plan = await this.planRepository.findOne({ where: { id: planId } });
        if (!plan) {
            return { statusCode: HttpStatus.NOT_FOUND, message: `Subscription Plan với ID ${planId} không tồn tại` };
        }

        // 4. Tạo orderCode không trùng
        let orderCode = await this.generateUniqueOrderCode();

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

        logger.debug('Data sent to PayOS:', paymentData);

        // 7. Gửi yêu cầu tạo Payment Link (lặp lại nếu thất bại)
        let paymentUrl: string | null = null;
        let retries = 3; // Số lần thử lại tối đa

        while (retries > 0) {
            try {
                paymentUrl = await this.payOSService.createPaymentLink(paymentData);

                if (paymentUrl) {
                    break; // Nếu tạo link thành công, thoát khỏi vòng lặp
                }
            } catch (error) {
                retries--; // Giảm số lần thử lại nếu gặp lỗi
                logger.error('Error creating payment link:', error.message);

                if (retries === 0) {
                    return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to create payment link after multiple attempts.' };
                }

                // Tạo lại orderCode nếu có lỗi "Đơn thanh toán đã tồn tại"
                if (error.message.includes("Đơn thanh toán đã tồn tại")) {
                    orderCode = await this.generateUniqueOrderCode(); // Tạo lại orderCode mới
                    paymentData.orderCode = orderCode; // Cập nhật orderCode trong dữ liệu
                }
            }
        }

        // 8. Cập nhật paymentLinkId
        if (paymentUrl) {
            savedSubscription.paymentLinkId = paymentUrl;
            savedSubscription.status = SubscriptionStatus.PENDING;  // Đảm bảo trạng thái là PENDING khi đang chờ thanh toán
            await this.subscriptionRepository.save(savedSubscription);

            return { statusCode: HttpStatus.CREATED, message: 'Subscription created successfully. Redirect to payment', paymentUrl };
        } else {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Payment link creation failed after retries' };
        }
    }

    // Helper function to handle Payment Link creation for failed subscriptions
    async createPaymentLinkAndUpdateSubscription(userId: number, planId: number): Promise<{ statusCode: number; message: string; paymentUrl?: string }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const plan = await this.planRepository.findOne({ where: { id: planId } });

        if (!user || !plan) {
            return { statusCode: HttpStatus.NOT_FOUND, message: 'User or Plan not found' };
        }

        // Tạo orderCode mới vì trạng thái là FAILED
        let orderCode = await this.generateUniqueOrderCode();

        // 6. Chuẩn bị dữ liệu gửi tới PayOS
        let paymentData = {
            orderCode, // orderCode mới được tạo
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

        // Gửi yêu cầu tạo Payment Link (lặp lại nếu thất bại)
        let paymentUrl: string | null = null;
        let retries = 3; // Số lần thử lại tối đa

        while (retries > 0) {
            try {
                paymentUrl = await this.payOSService.createPaymentLink(paymentData);

                if (paymentUrl) {
                    break; // Nếu tạo link thành công, thoát khỏi vòng lặp
                }
            } catch (error) {
                retries--; // Giảm số lần thử lại nếu gặp lỗi

                if (retries === 0) {
                    return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to create payment link after multiple attempts.' };
                }

                // Tạo lại orderCode nếu có lỗi "Đơn thanh toán đã tồn tại"
                if (error.message.includes("Đơn thanh toán đã tồn tại")) {
                    orderCode = await this.generateUniqueOrderCode(); // Tạo lại orderCode mới
                    paymentData.orderCode = orderCode; // Cập nhật orderCode trong dữ liệu
                }
            }
        }

        if (paymentUrl) {
            // Tạo Subscription mới
            const subscription = this.subscriptionRepository.create({
                user,
                subscriptionPlan: plan,
                amount: plan.price,
                status: SubscriptionStatus.PENDING,
                orderCode,
                paymentLinkId: paymentUrl,
            });

            const savedSubscription = await this.subscriptionRepository.save(subscription);

            return { statusCode: HttpStatus.CREATED, message: 'Payment link recreated successfully. Redirect to payment', paymentUrl };
        }

        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to recreate payment link.' };
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
    async getSubscriptionById(id: number): Promise<Subscription> {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id },
            relations: ['user', 'subscriptionPlan'], // Include relations if needed
        });

        if (!subscription) {
            throw new NotFoundException(`Subscription with ID ${id} not found`);
        }

        return subscription;
    }
    async hasValidSubscription(userId: number): Promise<boolean> {
        const subscription = await this.subscriptionRepository.findOne({
            where: { user: { id: userId } },
            relations: ['subscriptionPlan'], // Bao gồm thông tin gói đăng ký
        });

        if (!subscription) {
            return false; // Không có subscription nào
        }

        // Kiểm tra điều kiện: nếu subscriptionPlan.id !== 1 và status là ACCEPTED
        if (subscription.subscriptionPlan.id !== 1 && subscription.status === SubscriptionStatus.ACTIVE) {
            return true; // Có gói đăng ký hợp lệ
        }

        return false; // Không hợp lệ
    }


}
