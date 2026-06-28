import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ConsultationService } from './consultation.service';
import { CreateConsultationNoteDto } from './dto/create-consultation-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('consultation')
export class ConsultationController {
  constructor(
    private readonly consultationService: ConsultationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateConsultationNoteDto, @Req() req: any) {
    return this.consultationService.create(dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('appointment/:appointmentId')
  getByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.consultationService.getByAppointment(
      Number(appointmentId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('doctor/my')
  getMyConsultations(@Req() req: any) {
    return this.consultationService.getByDoctor(req.user.sub);
  }
}