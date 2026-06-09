import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { Hospital } from '../hospital/hospital.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';
import { Appointment } from '../appointment/appointment.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hospital,
      Doctor,
      Patient,
      Appointment,
    ]),

    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'doctor-platform-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),

    MailModule, // ✅ HERE
  ],

  controllers: [AdminController],

  providers: [AdminService],
})
export class AdminModule {}