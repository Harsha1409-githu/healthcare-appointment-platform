import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';

@Injectable()
export class PrescriptionPdfService {
  async generatePrescriptionPdf(prescription: any): Promise<Buffer> {
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
    });

    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));

    const qrUrl = `https://trydoc.co/rx/${prescription.id}`;
    const qrImage = await QRCode.toDataURL(qrUrl);

    const doctor = prescription.appointment?.doctor;
    const patient = prescription.appointment?.patient;
    const hospital = doctor?.hospital;

    // Header
    doc
      .fontSize(24)
      .fillColor('#0891b2')
      .text('TryDoc', { align: 'center' });

    doc
      .fontSize(10)
      .fillColor('#475569')
      .text('Smart Healthcare for Everyone', { align: 'center' });

    doc.moveDown(1);

    doc
      .strokeColor('#e2e8f0')
      .lineWidth(1)
      .moveTo(40, doc.y)
      .lineTo(555, doc.y)
      .stroke();

    doc.moveDown(1);

    // Hospital + Doctor
    doc.fontSize(14).fillColor('#0f172a').text(hospital?.hospitalName || 'Hospital');
    doc.fontSize(9).fillColor('#475569').text(hospital?.address || '');
    doc.text(`${hospital?.city || ''} ${hospital?.state || ''}`);
    doc.text(`Phone: ${hospital?.mobile || '-'} | Email: ${hospital?.email || '-'}`);

    doc.moveDown(1);

    doc.fontSize(12).fillColor('#0f172a').text(`Dr. ${doctor?.doctorName || 'Doctor'}`);
    doc.fontSize(9).fillColor('#475569').text(doctor?.qualification || '');
    doc.text(doctor?.specialization || '');
    doc.text(`Experience: ${doctor?.experience || 0} years`);

    doc.moveDown(1);

    // Patient details box
    this.sectionTitle(doc, 'Patient Details');

    this.row(doc, 'Name', patient?.fullName || prescription.patientName || '-');
    this.row(doc, 'Age / Gender', `${patient?.age || '-'} / ${patient?.gender || '-'}`);
    this.row(doc, 'Mobile', patient?.mobile || prescription.patientPhone || '-');
    this.row(doc, 'Prescription ID', `TRD-RX-${prescription.id}`);
    this.row(doc, 'Date', new Date().toLocaleDateString('en-IN'));

    doc.moveDown(1);

    // Diagnosis
    this.sectionTitle(doc, 'Diagnosis');
    doc.fontSize(11).fillColor('#0f172a').text(prescription.diagnosis || '-');
    doc.moveDown(1);

    // Medicines
    this.sectionTitle(doc, 'Prescription');
    doc.fontSize(10).fillColor('#0f172a');

    const medicines = String(prescription.medicines || '')
      .split('\n')
      .filter(Boolean);

    if (medicines.length === 0) {
      doc.text('No medicines added');
    } else {
      medicines.forEach((medicine, index) => {
        doc.text(`${index + 1}. ${medicine}`, {
          lineGap: 5,
        });
      });
    }

    doc.moveDown(1);

    // Lab tests
    this.sectionTitle(doc, 'Lab Tests');
    doc.fontSize(10).fillColor('#0f172a').text(prescription.labTests || '-');
    doc.moveDown(1);

    // Advice
    this.sectionTitle(doc, 'Advice');
    doc.fontSize(10).fillColor('#0f172a').text(prescription.advice || '-');
    doc.moveDown(2);

    // Signature + QR
    const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');

    doc.image(qrBuffer, 430, doc.y, {
      width: 90,
      height: 90,
    });

    doc
      .fontSize(10)
      .fillColor('#0f172a')
      .text('Doctor Signature', 40, doc.y + 20);

    doc.moveDown(3);

    doc
      .strokeColor('#94a3b8')
      .moveTo(40, doc.y)
      .lineTo(200, doc.y)
      .stroke();

    doc.moveDown(1);

    doc
      .fontSize(9)
      .fillColor('#475569')
      .text(`Dr. ${doctor?.doctorName || 'Doctor'}`);

    doc.moveDown(4);

    doc
      .fontSize(8)
      .fillColor('#64748b')
      .text(
        'This prescription was generated electronically using TryDoc. Scan the QR code to verify.',
        { align: 'center' },
      );

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }

  private sectionTitle(doc: PDFKit.PDFDocument, title: string) {
    doc
      .fontSize(12)
      .fillColor('#0891b2')
      .text(title, { underline: true });

    doc.moveDown(0.4);
  }

  private row(doc: PDFKit.PDFDocument, label: string, value: string) {
    doc
      .fontSize(9)
      .fillColor('#475569')
      .text(`${label}: `, { continued: true })
      .fillColor('#0f172a')
      .text(value);
  }
}