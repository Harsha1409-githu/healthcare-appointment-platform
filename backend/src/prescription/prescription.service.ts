import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Prescription } from './prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import {
  Appointment,
  AppointmentStatus,
} from '../appointment/appointment.entity';

import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepo: Repository<Prescription>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async createPrescription(dto: CreatePrescriptionDto) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: dto.appointmentId },
      relations: {
        doctor: true,
        patient: true,
        slot: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new BadRequestException(
        'Prescription can be added only after appointment is completed',
      );
    }

    if (!appointment.patient) {
      throw new BadRequestException(
        'Appointment is not linked with patient',
      );
    }

    const existingPrescription =
  await this.prescriptionRepo.findOne({
    where: {
      appointment: {
        id: dto.appointmentId,
      },
    },
  });

if (existingPrescription) {
  throw new BadRequestException(
    'Prescription already exists for this appointment',
  );
}

    const prescription = this.prescriptionRepo.create({
      appointment,
      doctor: appointment.doctor,
      patient: appointment.patient,
      diagnosis: dto.diagnosis,
      medicines: dto.medicines,
      notes: dto.notes,
    });

    return this.prescriptionRepo.save(prescription);
  }

  async getAllPrescriptions() {
    return this.prescriptionRepo.find({
      relations: {
        appointment: true,
        doctor: true,
        patient: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getMyPrescriptions(patientId: string) {
    return this.prescriptionRepo.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      relations: {
        appointment: true,
        doctor: true,
        patient: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getByAppointment(appointmentId: number) {
    return this.prescriptionRepo.findOne({
      where: {
        appointment: {
          id: appointmentId,
        },
      },
      relations: {
        appointment: true,
        doctor: true,
        patient: true,
      },
    });
  }

  async generatePdf(id: number, res: Response) {
    const prescription = await this.prescriptionRepo.findOne({
  where: { id },
  relations: {
    appointment: true,
    doctor: true,
    patient: true,
  },
});
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      'Content-Type',
      'application/pdf',
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=prescription-${id}.pdf`,
    );

    doc.pipe(res);

    doc
      .fontSize(22)
      .text('MEDICARE HOSPITAL', {
        align: 'center',
      });

    doc
      .fontSize(10)
      .text('Digital Prescription', {
        align: 'center',
      });

    doc.moveDown(2);

    doc.fontSize(12).text(
      `Prescription ID: ${prescription.id}`,
    );

    doc.text(
      `Date: ${new Date(
        prescription.createdAt,
      ).toLocaleDateString()}`,
    );

    doc.moveDown();

    doc.fontSize(14).text('Patient Details', {
      underline: true,
    });

    doc.fontSize(12).text(
      `Patient: ${
        prescription.patient?.fullName || ''
      }`,
    );

    doc.text(
      `Mobile: ${
        prescription.patient?.mobile || ''
      }`,
    );

    doc.moveDown();

    doc.fontSize(14).text('Doctor Details', {
      underline: true,
    });

    doc.fontSize(12).text(
      `Doctor: ${
        prescription.doctor?.doctorName || ''
      }`,
    );

    doc.text(
      `Specialization: ${
        prescription.doctor?.specialization || ''
      }`,
    );

    doc.moveDown();

    doc.fontSize(14).text('Diagnosis', {
      underline: true,
    });

    doc
      .fontSize(12)
      .text(prescription.diagnosis || '-');

    doc.moveDown();

    doc.fontSize(14).text('Medicines', {
      underline: true,
    });

    doc
      .fontSize(12)
      .text(prescription.medicines || '-');

    doc.moveDown();

    doc.fontSize(14).text('Notes', {
      underline: true,
    });

    doc
      .fontSize(12)
      .text(prescription.notes || '-');

    doc.moveDown(3);

    doc.text('Doctor Signature');

    doc.moveDown();

    doc
      .fontSize(10)
      .text(
        'This is a digitally generated prescription.',
        {
          align: 'center',
        },
      );

    doc.end();
  }
}