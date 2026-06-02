import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Slot } from './slot.entity';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';
import { Doctor } from '../doctor/doctor.entity';
import { DoctorAvailability } from '../availability/doctor-availability.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Slot,
      Doctor,
      DoctorAvailability,
    ]),
  ],
  controllers: [SlotController],
  providers: [SlotService],
})
export class SlotModule {}