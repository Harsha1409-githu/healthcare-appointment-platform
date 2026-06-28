import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CheckInService } from './check-in.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCheckInDto, @Req() req: any) {
    return this.checkInService.create(dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('appointment/:appointmentId')
  getByAppointment(
    @Param('appointmentId') appointmentId: string,
    @Req() req: any,
  ) {
    return this.checkInService.getByAppointment(
      Number(appointmentId),
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
@Get('doctor/appointment/:appointmentId')
getForDoctor(
  @Param('appointmentId') appointmentId: string,
  @Req() req: any,
) {
  return this.checkInService.getForDoctor(
    Number(appointmentId),
    req.user.sub,
  );
}

}