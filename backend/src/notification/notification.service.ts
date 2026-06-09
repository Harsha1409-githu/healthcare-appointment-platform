import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './notification.entity';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,

    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(data: {
    userId: string;
    role: string;
    title: string;
    message: string;
  }) {
    const notification = this.notificationRepo.create(data);

    const savedNotification =
      await this.notificationRepo.save(notification);

    this.notificationGateway.sendNotification({
      userId: data.userId,
      role: data.role,
      notification: savedNotification,
    });

    return savedNotification;
  }

  async getMyNotifications(userId: string, role: string) {
    return this.notificationRepo.find({
      where: {
        userId,
        role,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async markAsRead(id: number) {
    await this.notificationRepo.update(id, {
      isRead: true,
    });

    return {
      message: 'Notification marked as read',
    };
  }

  async markAllAsRead(userId: string, role: string) {
    await this.notificationRepo.update(
      {
        userId,
        role,
      },
      {
        isRead: true,
      },
    );

    return {
      message: 'All notifications marked as read',
    };
  }
}