import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';

import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  // TEMP DEV MODE: public booking for OTP testing
  @Post()
book(@Body() dto: CreateAppointmentDto) {
  if (!dto.patientId) {
    throw new BadRequestException('patientId is required');
  }

  return this.appointmentService.bookAppointment(
    dto,
    dto.patientId,
  );
}

  @Get()
  getAll() {
    return this.appointmentService.getAllAppointments();
  }

  @Get('analytics')
  getAnalytics() {
    return this.appointmentService.getAnalytics();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyAppointments(@Req() req: any) {
    return this.appointmentService.getMyAppointments(
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('hospital/my')
  getHospitalAppointments(@Req() req: any) {
    return this.appointmentService.getAppointmentsByHospital(
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('hospital/analytics')
  getHospitalAnalytics(@Req() req: any) {
    return this.appointmentService.getHospitalAnalytics(
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getAppointmentById(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(
      Number(id),
    );
  }

  @Get('doctor/:doctorId')
  getByDoctor(@Param('doctorId') doctorId: string) {
    return this.appointmentService.getAppointmentsByDoctor(
      doctorId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.appointmentService.cancelAppointment(
      Number(id),
      req.user.sub,
      req.user.role,
    );
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.appointmentService.completeAppointment(
      Number(id),
    );
  }
}