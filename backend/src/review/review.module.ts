import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Review } from './review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      Doctor,
      Patient,
    ]),

    NotificationModule,

    JwtModule.register({
      secret: 'doctor-platform-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, JwtAuthGuard],
})
export class ReviewModule {}