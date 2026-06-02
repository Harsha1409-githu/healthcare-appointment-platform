import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';

import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('prescription')
export class PrescriptionController {
  constructor(
    private readonly prescriptionService: PrescriptionService,
  ) {}

  @Post()
  create(@Body() dto: CreatePrescriptionDto) {
    return this.prescriptionService.createPrescription(dto);
  }

  @Get()
  getAll() {
    return this.prescriptionService.getAllPrescriptions();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyPrescriptions(@Req() req: any) {
    return this.prescriptionService.getMyPrescriptions(
      req.user.sub,
    );
  }

  @Get('appointment/:appointmentId')
  getByAppointment(
    @Param('appointmentId') appointmentId: string,
  ) {
    return this.prescriptionService.getByAppointment(
      Number(appointmentId),
    );
  }

  @Get(':id/pdf')
  downloadPdf(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.prescriptionService.generatePdf(
      Number(id),
      res,
    );
  }
}