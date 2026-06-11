import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Patient } from './patient.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';

import { Appointment } from '../appointment/appointment.entity';
import { Prescription } from '../prescription/prescription.entity';
import { MedicineReminder } from '../medicine-reminder/medicine-reminder.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: {
        expiresIn: '1d',
      },
    }),

    TypeOrmModule.forFeature([
      Patient,
      Appointment,
      Prescription,
      MedicineReminder,
    ]),
  ],

  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}