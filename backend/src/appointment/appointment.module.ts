import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';

import { Doctor } from '../doctor/doctor.entity';
import { Slot } from '../slot/slot.entity';
import { Patient } from '../patient/patient.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Doctor,
      Slot,
      Patient,
      MailModule,
    ]),

    JwtModule.register({
      secret: 'doctor-platform-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),

    MailModule,
  ],

  controllers: [AppointmentController],

  providers: [
    AppointmentService,
    JwtAuthGuard,
  ],
})
export class AppointmentModule {}