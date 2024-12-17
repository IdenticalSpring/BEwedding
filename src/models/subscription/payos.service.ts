import { Injectable } from '@nestjs/common';
import PayOS from '@payos/node';



@Injectable()
export class PayOSService {
    private payOSClient;

    constructor() {
        this.payOSClient = new PayOS(
            process.env.PAYOS_CLIENT_ID,
            process.env.PAYOS_API_KEY,
            process.env.PAYOS_CHECKSUM_KEY,
        );
    }

    // Tạo link thanh toán
    async createPaymentLink(orderData: {
        orderCode: number;
        amount: number;
        description: string;
        returnUrl: string;
        cancelUrl: string;
        items: { name: string; quantity: number; price: number }[];
    }): Promise<string> {
        try {
            const paymentLinkResponse = await this.payOSClient.createPaymentLink(orderData);
            return paymentLinkResponse.checkoutUrl; // URL cho khách hàng thanh toán
        } catch (error) {
            console.error('Error creating payment link:', error.response?.data || error.message);
            throw new Error('Failed to create payment link');
        }
    }

    // Lấy thông tin link thanh toán
    async getPaymentLinkInfo(orderCode: number | string): Promise<any> {
        try {
            return await this.payOSClient.getPaymentLinkInformation(orderCode);
        } catch (error) {
            console.error('Error retrieving payment link info:', error.response?.data || error.message);
            throw new Error('Failed to retrieve payment link information');
        }
    }

    // Hủy link thanh toán
    async cancelPaymentLink(orderCode: string | number, reason: string): Promise<any> {
        try {
            return await this.payOSClient.cancelPaymentLink(orderCode, reason);
        } catch (error) {
            console.error('Error cancelling payment link:', error.response?.data || error.message);
            throw new Error('Failed to cancel payment link');
        }
    }
    verifyPaymentWebhookData(webhookData: any): any {
        try {
            const verifiedData = this.payOSClient.verifyPaymentWebhookData(webhookData);
            return verifiedData;
        } catch (error) {
            console.error('Error verifying webhook data:', error.response?.data || error.message);
            throw new Error('Failed to verify webhook data');
        }
    }
}
