import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { LabTestService } from './lab-test.service';

@Controller('lab-test')
export class LabTestController {
  constructor(private readonly labTestService: LabTestService) {}

  @Post()
  create(@Body() body: any) {
    return this.labTestService.create(body);
  }

  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.labTestService.findByPatient(patientId);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.labTestService.cancel(id);
  }
}