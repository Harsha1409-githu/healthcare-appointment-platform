import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  book(@Body() dto: CreateAppointmentDto, @Req() req: any) {
    return this.appointmentService.bookAppointment(
      dto,
      req.user.sub,
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