import {
  Body,
  Controller,
  Post,
  Get,
} from '@nestjs/common';

import { HospitalService } from './hospital.service';

@Controller('hospital')
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.hospitalService.registerHospital(body);
  }

  @Get()
  async getAll() {
    return this.hospitalService.getAllHospitals();
  }
}