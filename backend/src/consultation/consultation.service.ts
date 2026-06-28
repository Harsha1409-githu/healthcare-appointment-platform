import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Consultation } from './consultation.entity';
import { Appointment } from '../appointment/appointment.entity';
import { CreateConsultationNoteDto } from './dto/create-consultation-note.dto';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepo: Repository<Consultation>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async create(dto: CreateConsultationNoteDto, doctorId: string) {
    if (!dto.appointmentId) {
      throw new BadRequestException('appointmentId is required');
    }

    if (!dto.diagnosis?.trim()) {
      throw new BadRequestException('Diagnosis is required');
    }

    const appointment = await this.appointmentRepo.findOne({
      where: { id: Number(dto.appointmentId) },
      relations: {
        doctor: true,
        patient: true,
        familyMember: true,
        slot: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctor?.id !== doctorId) {
      throw new ForbiddenException(
        'You can add notes only for your own appointment',
      );
    }

    const existing = await this.consultationRepo.findOne({
      where: {
        appointment: {
          id: appointment.id,
        },
      },
    });

   if (existing) {
  existing.diagnosis = dto.diagnosis;
  existing.doctorNotes = dto.doctorNotes || '';
  existing.advice = dto.advice || '';
  existing.followUpRequired = Boolean(dto.followUpRequired);

  const savedConsultation =
    await this.consultationRepo.save(existing);

  appointment.consultationCompleted = true;
  await this.appointmentRepo.save(appointment);

  return savedConsultation;
}

    const consultation = this.consultationRepo.create({
      appointment,
      doctor: appointment.doctor,
      patient: appointment.patient,
      diagnosis: dto.diagnosis,
      doctorNotes: dto.doctorNotes || '',
      advice: dto.advice || '',
      followUpRequired: Boolean(dto.followUpRequired),
    });

    const savedConsultation =
  await this.consultationRepo.save(consultation);

appointment.consultationCompleted = true;
await this.appointmentRepo.save(appointment);

return savedConsultation;
  }

  
  async getByAppointment(appointmentId: number) {
    const consultation = await this.consultationRepo.findOne({
      where: {
        appointment: {
          id: appointmentId,
        },
      },
    });

    return consultation || null;
  }

  async getByDoctor(doctorId: string) {
    return this.consultationRepo.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  
}
