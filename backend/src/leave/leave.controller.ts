import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';

import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Controller('leave')
export class LeaveController {
  constructor(
    private readonly leaveService: LeaveService,
  ) {}

  @Post()
  create(@Body() dto: CreateLeaveDto) {
    return this.leaveService.create(dto);
  }

  @Get('doctor/:doctorId')
  getDoctorLeaves(
    @Param('doctorId') doctorId: string,
  ) {
    return this.leaveService.getDoctorLeaves(
      doctorId,
    );
  }

  @Get('check/:doctorId/:date')
checkLeave(
  @Param('doctorId') doctorId: string,
  @Param('date') date: string,
) {
  return this.leaveService.isDoctorOnLeave(doctorId, date);
}

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.leaveService.delete(id);
  }
}