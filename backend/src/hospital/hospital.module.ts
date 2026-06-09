import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Hospital } from './hospital.entity';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';

import { Doctor } from '../doctor/doctor.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Slot } from '../slot/slot.entity';

import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hospital,
      Doctor,
      Appointment,
      Slot,
    ]),

    JwtModule.register({
      secret: 'doctor-platform-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),

    MailModule,
  ],

  controllers: [HospitalController],

  providers: [HospitalService],

  exports: [HospitalService],
})
export class HospitalModule {}