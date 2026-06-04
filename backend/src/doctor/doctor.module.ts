import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Doctor } from './doctor.entity';
import { Hospital } from '../hospital/hospital.entity';

import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctor,
      Hospital,
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

  controllers: [DoctorController],

  providers: [DoctorService],

  exports: [DoctorService],
})
export class DoctorModule {}