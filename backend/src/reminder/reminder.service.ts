import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppointmentService } from '../appointment/appointment.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ReminderService {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron('0 */15 * * * *')
  async sendAppointmentReminders() {
    const appointments =
      await this.appointmentService.findUpcomingAppointments();

    const now = new Date();

    for (const appointment of appointments) {
      if (!appointment.slot?.date || !appointment.slot?.startTime) {
        continue;
      }

      const appointmentDateTime = new Date(
        `${appointment.slot.date}T${appointment.slot.startTime}`,
      );

      const diffMinutes =
        (appointmentDateTime.getTime() - now.getTime()) /
        (1000 * 60);

      if (diffMinutes <= 60 && diffMinutes > 45) {
        await this.notificationService.createOnce({
          userId: appointment.patient.id,
          role: 'patient',
          appointmentId: String(appointment.id),
          title: 'Appointment Reminder',
          message: `You have an appointment with Dr. ${appointment.doctor.doctorName} in 1 hour.`,
        });
      }

      if (diffMinutes <= 15 && diffMinutes > 0) {
        await this.notificationService.createOnce({
          userId: appointment.patient.id,
          role: 'patient',
          appointmentId: String(appointment.id),
          title: 'Appointment Starting Soon',
          message: 'Your consultation starts in 15 minutes.',
        });
      }
    }
  }
}