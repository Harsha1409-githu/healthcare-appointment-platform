import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Prescription } from './prescription.entity';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';

import { Appointment } from '../appointment/appointment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prescription, Appointment]),

    JwtModule.register({
      secret: 'doctor-platform-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService, JwtAuthGuard],
})
export class PrescriptionModule {}