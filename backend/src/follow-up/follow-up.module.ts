import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowUp } from './follow-up.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';

import { FollowUpService } from './follow-up.service';
import { FollowUpController } from './follow-up.controller';
import { Appointment } from '../appointment/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
  FollowUp,
  Doctor,
  Patient,
  Appointment,
]),
  ],
  providers: [FollowUpService],
  controllers: [FollowUpController],
})
export class FollowUpModule {}