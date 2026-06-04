import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { HospitalService } from './hospital.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    return this.hospitalService.getDashboard(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('doctors')
  async getMyDoctors(@Req() req: any) {
    return this.hospitalService.getMyDoctors(req.user.sub);
  }
}