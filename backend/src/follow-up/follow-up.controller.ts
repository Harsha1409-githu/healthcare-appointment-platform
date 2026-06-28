import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { FollowUpService } from './follow-up.service';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';

@Controller('follow-up')
export class FollowUpController {
  constructor(
    private readonly followUpService: FollowUpService,
  ) {}

  @Post()
  create(@Body() dto: CreateFollowUpDto) {
    return this.followUpService.create(dto);
  }

  @Get('doctor/:doctorId')
  getDoctorFollowUps(
    @Param('doctorId') doctorId: string,
  ) {
    return this.followUpService.getDoctorFollowUps(
      doctorId,
    );
  }

  @Get('patient/:patientId')
  getPatientFollowUps(
    @Param('patientId') patientId: string,
  ) {
    return this.followUpService.getPatientFollowUps(
      patientId,
    );
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.followUpService.markCompleted(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.followUpService.delete(id);
  }
}