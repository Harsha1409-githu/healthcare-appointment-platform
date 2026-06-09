import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),

    JwtModule.register({
      secret: 'doctor-platform-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}