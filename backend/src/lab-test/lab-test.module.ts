import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { LabTest } from './lab-test.entity';

import { LabOrder } from './lab-order.entity';

import { LabOrderItem } from './lab-order-item.entity';

import { LabTestService } from './lab-test.service';

import { LabTestController } from './lab-test.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LabTest,
      LabOrder,
      LabOrderItem,
    ]),
  ],

  providers: [
    LabTestService,
  ],

  controllers: [
    LabTestController,
  ],
})
export class LabTestModule {}