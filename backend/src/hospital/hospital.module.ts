import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Hospital } from './hospital.entity';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';

import { Doctor } from '../doctor/doctor.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Slot } from '../slot/slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hospital,
      Doctor,
      Appointment,
      Slot,
    ]),

    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'doctor-platform-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [HospitalController],

  providers: [HospitalService],
})
export class HospitalModule {}