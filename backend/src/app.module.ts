import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HospitalModule } from './hospital/hospital.module';
import { Hospital } from './hospital/hospital.entity';

import { DoctorModule } from './doctor/doctor.module';
import { Doctor } from './doctor/doctor.entity';

import { AuthModule } from './auth/auth.module';

import { SlotModule } from './slot/slot.module';
import { Slot } from './slot/slot.entity';

import { AppointmentModule } from './appointment/appointment.module';
import { Appointment } from './appointment/appointment.entity';

import { PatientModule } from './patient/patient.module';
import { Patient } from './patient/patient.entity';

import { AvailabilityModule } from './availability/availability.module';
import { DoctorAvailability } from './availability/doctor-availability.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './review/review.entity';
import { PaymentModule } from './payment/payment.module';
import { MailModule } from './mail/mail.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { Prescription } from './prescription/prescription.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

   ssl:
  process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,


      entities: [
        Hospital,
        Doctor,
        Slot,
        Appointment,
        Patient,
        DoctorAvailability,
        Review,
        Prescription,
      ],

      synchronize: true,
    }),

    HospitalModule,
    DoctorModule,
    AuthModule,
    SlotModule,
    AppointmentModule,
    PatientModule,
    AvailabilityModule,
    ReviewModule,
    PaymentModule,
    MailModule,
    PrescriptionModule,
  ],

  controllers: [AppController],  // ✅ FIX
  providers: [AppService],       // ✅ FIX
})
export class AppModule {}