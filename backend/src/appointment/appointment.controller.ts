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
    return this.appointmentService.getMyAppointments(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('hospital/my')
  getHospitalAppointments(@Req() req: any) {
    return this.appointmentService.getAppointmentsByHospital(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('hospital/analytics')
  getHospitalAnalytics(@Req() req: any) {
    return this.appointmentService.getHospitalAnalytics(req.user.sub);
  }

  @Get(':id/patient-profile')
  getPatientProfile(@Param('id') id: string) {
    return this.appointmentService.getPatientProfile(Number(id));
  }

  @Patch(':id/no-show-patient')
  markPatientNoShow(@Param('id') id: string) {
    return this.appointmentService.markPatientNoShow(Number(id));
  }

  @Patch(':id/no-show-doctor')
  markDoctorNoShow(@Param('id') id: string) {
    return this.appointmentService.markDoctorNoShow(Number(id));
  }

  @Patch(':id/documentation-pending')
  markDocumentationPending(@Param('id') id: string) {
    return this.appointmentService.markDocumentationPending(Number(id));
  }

  @Patch(':id/consultation-active')
  markConsultationActive(@Param('id') id: string) {
    return this.appointmentService.markConsultationActive(Number(id));
  }

  @Patch(':id/check-in')
  markCheckedIn(@Param('id') id: string) {
    return this.appointmentService.markCheckedIn(Number(id));
  }

  @Get('doctor/:doctorId/earnings')
  getDoctorEarnings(@Param('doctorId') doctorId: string) {
    return this.appointmentService.getDoctorEarnings(doctorId);
  }

  @Get('doctor/:doctorId')
  getByDoctor(@Param('doctorId') doctorId: string) {
    return this.appointmentService.getAppointmentsByDoctor(doctorId);
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reschedule')
  reschedule(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { newSlotId: string },
  ) {
    return this.appointmentService.rescheduleAppointment(
      Number(id),
      body.newSlotId,
      req.user.sub,
    );
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.appointmentService.completeAppointment(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getAppointmentById(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(Number(id));
  }
}