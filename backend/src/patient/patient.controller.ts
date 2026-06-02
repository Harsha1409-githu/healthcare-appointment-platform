import {
  Controller,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patient')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
  ) {}

  @Post('register')
  register(
    @Body() dto: CreatePatientDto,
  ) {
    return this.patientService.register(dto);
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }
}