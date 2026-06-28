import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

import { Appointment } from './appointment.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Slot } from '../slot/slot.entity';
import { Patient } from '../patient/patient.entity';
import { SymptomHistory } from '../symptom-history/symptom-history.entity';
import { MedicalRecord } from '../medical-record/medical-record.entity';
import { Prescription } from '../prescription/prescription.entity';
import { FollowUp } from '../follow-up/follow-up.entity';
import { FamilyMember } from '../family-member/family-member.entity';

import { MailModule } from '../mail/mail.module';
import { NotificationModule } from '../notification/notification.module';
import { JwtModule } from '@nestjs/jwt';
import { Consultation } from '../consultation/consultation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Doctor,
      Slot,
      Patient,
      FamilyMember,
      SymptomHistory,
      MedicalRecord,
      Prescription,
      FollowUp,
      Consultation,
    ]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '7d' },
    }),

    MailModule,
    NotificationModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}