import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Consultation } from './consultation.entity';
import { ConsultationController } from './consultation.controller';
import { ConsultationService } from './consultation.service';
import { Appointment } from '../appointment/appointment.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation, Appointment]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ConsultationController],
  providers: [ConsultationService],
  exports: [ConsultationService],
})
export class ConsultationModule {}