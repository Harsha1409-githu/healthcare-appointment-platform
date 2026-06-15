import { Injectable, BadRequestException } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys missing in .env');
    }

    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid payment amount');
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    return await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: true,
    });
  }

  verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    if (
      !data.razorpay_order_id ||
      !data.razorpay_payment_id ||
      !data.razorpay_signature
    ) {
      throw new BadRequestException('Missing payment verification data');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== data.razorpay_signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    return {
      message: 'Payment verified successfully',
    };
  }
}