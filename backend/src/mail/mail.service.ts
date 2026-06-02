import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAppointmentConfirmation(data: {
    to: string;
    patientName: string;
    doctorName: string;
    specialization: string;
    date: string;
    startTime: string;
    endTime: string;
    hospitalName?: string;
    fee: number;
  }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Appointment Confirmed - MediCare',
      html: `
        <h2>Appointment Confirmed ✅</h2>
        <p>Hello ${data.patientName},</p>

        <p>Your appointment has been successfully booked.</p>

        <hr />

        <p><strong>Doctor:</strong> ${data.doctorName}</p>
        <p><strong>Specialization:</strong> ${data.specialization}</p>
        <p><strong>Hospital:</strong> ${data.hospitalName || 'MediCare Hospital'}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
        <p><strong>Consultation Fee:</strong> ₹${data.fee}</p>

        <hr />

        <p>Thank you for using MediCare.</p>
      `,
    });
  }
}