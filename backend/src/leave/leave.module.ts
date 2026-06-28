import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DoctorLeave } from './doctor-leave.entity';
import { Doctor } from '../doctor/doctor.entity';

import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DoctorLeave,
      Doctor,
    ]),
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}