import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { MedicineReminderService } from './medicine-reminder.service';

@Controller('medicine-reminder')
export class MedicineReminderController {
  constructor(
    private readonly reminderService: MedicineReminderService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.reminderService.create(body);
  }

  @Get('patient/:patientId')
  getPatientReminders(
    @Param('patientId') patientId: string,
  ) {
    return this.reminderService.findByPatient(patientId);
  }
}