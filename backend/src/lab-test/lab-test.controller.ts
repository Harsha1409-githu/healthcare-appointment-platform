import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { LabTestService } from './lab-test.service';

import { CreateLabOrderDto } from './dto/create-lab-order.dto';

@Controller('lab-test')
export class LabTestController {
  constructor(
    private readonly labTestService: LabTestService,
  ) {}

  // OLD FLOW

  @Post()
  create(@Body() body: any) {
    return this.labTestService.create(
      body,
    );
  }

  @Get('patient/:patientId')
  findByPatient(
    @Param('patientId')
    patientId: string,
  ) {
    return this.labTestService.findByPatient(
      patientId,
    );
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.labTestService.cancel(
      id,
    );
  }

  // NEW ORDER FLOW

  @Post('order')
  createOrder(
    @Body()
    dto: CreateLabOrderDto,
  ) {
    return this.labTestService.createOrder(
      dto,
    );
  }

  @Get(
    'orders/patient/:patientId',
  )
  findOrders(
    @Param('patientId')
    patientId: string,
  ) {
    return this.labTestService.findOrdersByPatient(
      patientId,
    );
  }

  @Patch('order/:id/cancel')
  cancelOrder(
    @Param('id') id: string,
  ) {
    return this.labTestService.cancelOrder(
      id,
    );
  }
}