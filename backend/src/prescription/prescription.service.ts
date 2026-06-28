import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { Response } from 'express';

import { Prescription } from './prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import {
  Appointment,
  AppointmentStatus,
} from '../appointment/appointment.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepo: Repository<Prescription>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    private readonly mailService: MailService,
  ) {}

  async createPrescription(dto: CreatePrescriptionDto) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: dto.appointmentId },
      relations: {
        doctor: { hospital: true },
        patient: true,
        slot: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (!appointment.patient) {
      throw new BadRequestException('Appointment is not linked with patient');
    }

    const existingPrescription = await this.prescriptionRepo.findOne({
      where: {
        appointment: { id: dto.appointmentId },
      },
    });

    if (existingPrescription) {
      existingPrescription.diagnosis = dto.diagnosis;
      existingPrescription.medicines = dto.medicines;
      existingPrescription.notes = dto.notes || '';
      const updated = await this.prescriptionRepo.save(existingPrescription);
      return updated;
    }

    const prescription = this.prescriptionRepo.create({
      appointment,
      doctor: appointment.doctor,
      patient: appointment.patient,
      diagnosis: dto.diagnosis,
      medicines: dto.medicines,
      notes: dto.notes || '',
    });

    const savedPrescription = await this.prescriptionRepo.save(prescription);

    appointment.prescriptionCompleted = true;
    await this.appointmentRepo.save(appointment);

    try {
      await this.mailService.sendPrescriptionReady({
        to: appointment.patient.email,
        patientName: appointment.patient.fullName,
        doctorName: appointment.doctor.doctorName,
      });
    } catch (error) {
      console.error('Prescription email failed:', error);
    }

    return savedPrescription;
  }

  async getAllPrescriptions() {
    return this.prescriptionRepo.find({
      relations: {
        appointment: true,
        doctor: { hospital: true },
        patient: true,
      },
      order: { id: 'DESC' },
    });
  }

  async getMyPrescriptions(patientId: string) {
    return this.prescriptionRepo.find({
      where: { patient: { id: patientId } },
      relations: {
        appointment: true,
        doctor: { hospital: true },
        patient: true,
      },
      order: { id: 'DESC' },
    });
  }

  async getByAppointment(appointmentId: number) {
    return this.prescriptionRepo.findOne({
      where: {
        appointment: { id: appointmentId },
      },
      relations: {
        appointment: true,
        doctor: { hospital: true },
        patient: true,
      },
    });
  }

  async findOne(id: number) {
    const prescription = await this.prescriptionRepo.findOne({
      where: { id },
      relations: {
        appointment: { slot: true },
        doctor: { hospital: true },
        patient: true,
      },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return prescription;
  }

  async generatePdf(id: number, res: Response) {
    const prescription = await this.findOne(id);

    const hospital = prescription.doctor?.hospital;
    const doctor = prescription.doctor;
    const patient = prescription.patient;
    const appointment = prescription.appointment;

    const hospitalName = hospital?.hospitalName || 'TryDoc Hospital';
    const prescriptionNo = `TRD-RX-${String(prescription.id).padStart(6, '0')}`;

    const appointmentDate = appointment?.slot?.date || '-';
    const appointmentTime = appointment?.slot
      ? `${appointment.slot.startTime} - ${appointment.slot.endTime}`
      : '-';

    const qrUrl = `https://trydoc.co/rx/${prescriptionNo}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl);
    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

    const doc = new PDFDocument({
      size: 'A4',
      margin: 45,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=trydoc-prescription-${prescriptionNo}.pdf`,
    );

    doc.pipe(res);

    this.header(doc, hospitalName);

    this.infoBox(doc, 'Doctor Details', [
      `Doctor: Dr. ${doctor?.doctorName || '-'}`,
      `Specialization: ${doctor?.specialization || '-'}`,
      `Qualification: ${doctor?.qualification || '-'}`,
      `Experience: ${doctor?.experience || 0} years`,
      `Hospital: ${hospitalName}`,
    ]);

    this.infoBox(doc, 'Patient Details', [
      `Name: ${patient?.fullName || '-'}`,
      `Age / Gender: ${patient?.age || '-'} / ${patient?.gender || '-'}`,
      `Mobile: ${patient?.mobile || '-'}`,
      `Date: ${appointmentDate}`,
      `Time: ${appointmentTime}`,
    ]);

    this.sectionTitle(doc, 'Diagnosis');
    doc.fontSize(11).fillColor('#0f172a').text(prescription.diagnosis || '-');
    doc.moveDown(1);

    this.sectionTitle(doc, 'Medicines');
    this.medicineTable(doc, prescription.medicines || '-');

    this.sectionTitle(doc, 'Advice / Notes');
    doc.fontSize(10).fillColor('#0f172a').text(prescription.notes || '-');
    doc.moveDown(1.5);

    const signatureY = doc.y + 10;

    doc
      .fontSize(10)
      .fillColor('#0f172a')
      .text('Doctor Signature', 45, signatureY);

    doc
      .strokeColor('#94a3b8')
      .moveTo(45, signatureY + 35)
      .lineTo(220, signatureY + 35)
      .stroke();

    doc
      .fontSize(10)
      .fillColor('#0f172a')
      .text(`Dr. ${doctor?.doctorName || '-'}`, 45, signatureY + 45);

    doc.image(qrBuffer, 430, signatureY, {
      width: 90,
      height: 90,
    });

    doc
      .fontSize(8)
      .fillColor('#64748b')
      .text('Scan to verify', 432, signatureY + 92, {
        width: 90,
        align: 'center',
      });

    doc.moveDown(7);

    doc
      .strokeColor('#e2e8f0')
      .moveTo(45, 760)
      .lineTo(550, 760)
      .stroke();

    doc
      .fontSize(8)
      .fillColor('#64748b')
      .text(
        `${prescriptionNo} • Generated by TryDoc • Smart Healthcare for Everyone`,
        45,
        770,
        { align: 'center', width: 510 },
      );

    doc
      .fontSize(8)
      .fillColor('#64748b')
      .text('This is an electronically generated prescription.', {
        align: 'center',
        width: 510,
      });

    doc.end();
  }

  private header(doc: PDFKit.PDFDocument, hospitalName: string) {
    doc
      .fontSize(26)
      .fillColor('#0891b2')
      .text('TryDoc', { align: 'center' });

    doc
      .fontSize(10)
      .fillColor('#475569')
      .text('Smart Healthcare for Everyone', { align: 'center' });

    doc.moveDown(0.6);

    doc
      .fontSize(17)
      .fillColor('#0f172a')
      .text(hospitalName, { align: 'center' });

    doc
      .fontSize(10)
      .fillColor('#64748b')
      .text('Digital Medical Prescription', { align: 'center' });

    doc.moveDown(1);

    doc
      .strokeColor('#e2e8f0')
      .moveTo(45, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(1);
  }

  private sectionTitle(doc: PDFKit.PDFDocument, title: string) {
    doc
      .fontSize(13)
      .fillColor('#0891b2')
      .text(title, { underline: true });

    doc.moveDown(0.5);
  }

  private infoBox(doc: PDFKit.PDFDocument, title: string, lines: string[]) {
    const startY = doc.y;

    doc
      .roundedRect(45, startY, 510, 105, 10)
      .fillAndStroke('#f8fafc', '#e2e8f0');

    doc
      .fontSize(12)
      .fillColor('#0891b2')
      .text(title, 60, startY + 12);

    let y = startY + 34;

    lines.forEach((line) => {
      doc.fontSize(9).fillColor('#0f172a').text(line, 60, y);
      y += 14;
    });

    doc.y = startY + 120;
  }

  private medicineTable(doc: PDFKit.PDFDocument, medicinesText: string) {
    const medicines = String(medicinesText)
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean);

    if (medicines.length === 0) {
      doc.fontSize(10).fillColor('#0f172a').text('-');
      doc.moveDown(1);
      return;
    }

    medicines.forEach((medicine, index) => {
      doc
        .roundedRect(45, doc.y, 510, 34, 8)
        .fillAndStroke('#f8fafc', '#e2e8f0');

      doc
        .fontSize(10)
        .fillColor('#0f172a')
        .text(`${index + 1}. ${medicine}`, 58, doc.y + 10, {
          width: 480,
        });

      doc.y += 45;
    });

    doc.moveDown(0.5);
  }
}