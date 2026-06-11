import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { SymptomHistory } from './symptom-history.entity';
import { SymptomHistoryService } from './symptom-history.service';
import { SymptomHistoryController } from './symptom-history.controller';

import { Patient } from '../patient/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SymptomHistory,
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

  controllers: [SymptomHistoryController],

  providers: [SymptomHistoryService],
})
export class SymptomHistoryModule {}