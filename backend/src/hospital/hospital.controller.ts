import { Body, Controller, Post } from '@nestjs/common';
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
}