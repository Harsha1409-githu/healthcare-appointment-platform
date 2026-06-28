import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FollowUp } from './follow-up.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';
import { Appointment } from '../appointment/appointment.entity';

import { CreateFollowUpDto } from './dto/create-follow-up.dto';

@Injectable()
export class FollowUpService {
  constructor(
    @InjectRepository(FollowUp)
    private followUpRepo: Repository<FollowUp>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async create(dto: CreateFollowUpDto) {
    const doctor = await this.doctorRepo.findOne({
      where: { id: dto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const patient = await this.patientRepo.findOne({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const appointment = await this.appointmentRepo.findOne({
      where: { id: Number(dto.appointmentId) },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const existing = await this.followUpRepo.findOne({
      where: {
        appointment: {
          id: Number(dto.appointmentId),
        },
        status: 'PENDING',
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Follow-up already scheduled',
      );
    }

    const followUp = this.followUpRepo.create({
      doctor,
      patient,
      appointment,
      followUpDate: dto.followUpDate,
      notes: dto.notes,
      status: 'PENDING',
    });

    appointment.followUpScheduled = true;
    await this.appointmentRepo.save(appointment);

    return this.followUpRepo.save(followUp);
  }

  async getDoctorFollowUps(doctorId: string) {
    return this.followUpRepo.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      relations: {
        patient: true,
        doctor: true,
        appointment: true,
      },
      order: {
        followUpDate: 'ASC',
      },
    });
  }

  async getPatientFollowUps(patientId: string) {
    return this.followUpRepo.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      relations: {
        patient: true,
        doctor: true,
        appointment: true,
      },
      order: {
        followUpDate: 'ASC',
      },
    });
  }

  async markCompleted(id: string) {
    const followUp = await this.followUpRepo.findOne({
      where: { id },
    });

    if (!followUp) {
      throw new NotFoundException('Follow-up not found');
    }

    followUp.status = 'COMPLETED';

    return this.followUpRepo.save(followUp);
  }

  async delete(id: string) {
    await this.followUpRepo.delete(id);

    return {
      message: 'Follow-up deleted',
    };
  }
}