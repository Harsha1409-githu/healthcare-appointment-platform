import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';

import { DoctorAvailability } from './doctor-availability.entity';
import { Doctor } from '../doctor/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DoctorAvailability,
      Doctor,
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AvailabilityModule {}