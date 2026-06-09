import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Patient } from './patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),

    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'doctor-platform-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [PatientController],

  providers: [PatientService],
})
export class PatientModule {}