import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { MedicalRecord } from './medical-record.entity';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordController } from './medical-record.controller';

import { Patient } from '../patient/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicalRecord,
      Patient,
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

  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],

  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}