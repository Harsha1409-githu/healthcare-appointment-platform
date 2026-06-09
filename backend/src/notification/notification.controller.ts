import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Get('my')
  getMyNotifications(@Req() req: any) {
    return this.notificationService.getMyNotifications(
      req.user.sub,
      req.user.role,
    );
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(Number(id));
  }

  @Patch('read-all')
  markAllAsRead(@Req() req: any) {
    return this.notificationService.markAllAsRead(
      req.user.sub,
      req.user.role,
    );
  }
}