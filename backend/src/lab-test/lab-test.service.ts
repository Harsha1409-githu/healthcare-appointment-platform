import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  LabTest,
  LabTestStatus,
} from './lab-test.entity';

import {
  LabOrder,
  LabOrderStatus,
} from './lab-order.entity';

import { LabOrderItem } from './lab-order-item.entity';

import { CreateLabOrderDto } from './dto/create-lab-order.dto';

@Injectable()
export class LabTestService {
  constructor(
    @InjectRepository(LabTest)
    private labTestRepo: Repository<LabTest>,

    @InjectRepository(LabOrder)
    private labOrderRepo: Repository<LabOrder>,

    @InjectRepository(LabOrderItem)
    private labOrderItemRepo: Repository<LabOrderItem>,
  ) {}

  // OLD FLOW (keep for compatibility)

  create(data: Partial<LabTest>) {
    const booking = this.labTestRepo.create(data);
    return this.labTestRepo.save(booking);
  }

  findByPatient(patientId: string) {
    return this.labTestRepo.find({
      where: { patientId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async cancel(id: string) {
    const booking =
      await this.labTestRepo.findOne({
        where: { id },
      });

    if (!booking) {
      throw new NotFoundException(
        'Lab test booking not found',
      );
    }

    booking.status =
      LabTestStatus.CANCELLED;

    return this.labTestRepo.save(
      booking,
    );
  }

  // NEW ORDER FLOW

  async createOrder(
    dto: CreateLabOrderDto,
  ) {
    const orderNumber =
      'LAB-' +
      Date.now().toString().slice(-8);

    const totalAmount =
      dto.tests.reduce(
        (sum, item) =>
          sum + Number(item.price),
        0,
      );

    const order =
      this.labOrderRepo.create({
        orderNumber,
        patientId: dto.patientId,
        familyMemberId:
          dto.familyMemberId,

        preferredDate:
          dto.preferredDate,

        preferredTime:
          dto.preferredTime,

        address: dto.address,

        totalAmount,

        items: dto.tests.map(
          (test) => ({
            testName:
              test.testName,
            category:
              test.category,
            price: test.price,
          }),
        ),
      });

    return this.labOrderRepo.save(
      order,
    );
  }

  findOrdersByPatient(
    patientId: string,
  ) {
    return this.labOrderRepo.find({
      where: {
        patientId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async cancelOrder(id: string) {
    const order =
      await this.labOrderRepo.findOne({
        where: { id },
      });

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    order.status =
      LabOrderStatus.CANCELLED;

    return this.labOrderRepo.save(
      order,
    );
  }
}