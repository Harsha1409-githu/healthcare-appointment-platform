import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}