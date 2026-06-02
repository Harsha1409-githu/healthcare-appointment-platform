import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('order')
  createOrder(@Body() body: { amount: number }) {
    return this.paymentService.createOrder(body.amount);
  }

  @Post('verify')
  verifyPayment(
    @Body()
    body: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
  ) {
    return this.paymentService.verifyPayment(body);
  }
}