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

  async sendAppointmentCancelled(data: {
    to: string;
    patientName: string;
    doctorName: string;
    date?: string;
    startTime?: string;
  }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Appointment Cancelled - MediCare',
      html: `
        <h2>Appointment Cancelled ❌</h2>

        <p>Hello ${data.patientName},</p>

        <p>
          Your appointment with Dr. ${data.doctorName}
          has been cancelled.
        </p>

        ${data.date ? `<p><strong>Date:</strong> ${data.date}</p>` : ''}
        ${data.startTime ? `<p><strong>Time:</strong> ${data.startTime}</p>` : ''}

        <hr />

        <p>You can login to MediCare and book another available slot.</p>

        <p>Regards,</p>
        <p><strong>MediCare Team</strong></p>
      `,
    });
  }

  async sendAppointmentCompleted(data: {
    to: string;
    patientName: string;
    doctorName: string;
  }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Consultation Completed - MediCare',
      html: `
        <h2>Consultation Completed ✅</h2>

        <p>Hello ${data.patientName},</p>

        <p>
          Your consultation with Dr. ${data.doctorName}
          has been marked as completed.
        </p>

        <p>
          If your doctor creates a prescription, you will be notified once it is ready.
        </p>

        <hr />

        <p>Regards,</p>
        <p><strong>MediCare Team</strong></p>
      `,
    });
  }

  async sendPrescriptionReady(data: {
    to: string;
    patientName: string;
    doctorName: string;
  }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Your Prescription is Ready - MediCare',
      html: `
        <h2>Prescription Ready 💊</h2>

        <p>Hello ${data.patientName},</p>

        <p>
          Your prescription from Dr. ${data.doctorName}
          is now available in your MediCare account.
        </p>

        <p>
          Please login and download it from your prescriptions section.
        </p>

        <hr />

        <p>Regards,</p>
        <p><strong>MediCare Team</strong></p>
      `,
    });
  }

  async sendHospitalApproved(data: {
  to: string;
  hospitalName: string;
}) {
  await this.mailerService.sendMail({
    to: data.to,
    subject: 'Hospital Account Approved - MediCare',
    html: `
      <h2>Hospital Account Approved ✅</h2>

      <p>Hello ${data.hospitalName},</p>

      <p>Your hospital account has been approved by the MediCare admin team.</p>

      <p>You can now login and start managing doctors, availability and appointments.</p>

      <hr />

      <p>Regards,</p>
      <p><strong>MediCare Team</strong></p>
    `,
  });
}

async sendHospitalRejected(data: {
  to: string;
  hospitalName: string;
}) {
  await this.mailerService.sendMail({
    to: data.to,
    subject: 'Hospital Account Rejected - MediCare',
    html: `
      <h2>Hospital Account Rejected ❌</h2>

      <p>Hello ${data.hospitalName},</p>

      <p>Your hospital registration request was rejected by the MediCare admin team.</p>

      <p>Please verify your hospital details and contact support if you think this was a mistake.</p>

      <hr />

      <p>Regards,</p>
      <p><strong>MediCare Team</strong></p>
    `,
  });
}
}