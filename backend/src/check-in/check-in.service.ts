import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CheckIn } from './check-in.entity';
import { Appointment } from '../appointment/appointment.entity';
import { CreateCheckInDto } from './dto/create-check-in.dto';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckIn)
    private checkInRepo: Repository<CheckIn>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async create(dto: CreateCheckInDto, patientId: string) {
  const appointment = await this.appointmentRepo.findOne({
    where: { id: Number(dto.appointmentId) },
    relations: {
      patient: true,
      doctor: true,
      slot: true,
      familyMember: true,
    },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  if (appointment.patient?.id !== patientId) {
    throw new ForbiddenException(
      'You can check in only for your own appointment',
    );
  }

 const existing = await this.checkInRepo.findOne({
  where: {
    appointment: {
      id: appointment.id,
    },
  },
});

  if (existing) {
    throw new BadRequestException('Check-in already completed');
  }

  const checkIn = this.checkInRepo.create({
    appointment,
    temperature: dto.temperature,
    bloodPressure: dto.bloodPressure,
    weight: dto.weight,
    symptoms: dto.symptoms,
    notes: dto.notes,
  });

  return this.checkInRepo.save(checkIn);
}

  async getByAppointment(appointmentId: number, patientId: string) {
  const appointment = await this.appointmentRepo.findOne({
    where: { id: appointmentId },
    relations: {
      patient: true,
    },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  if (appointment.patient?.id !== patientId) {
    throw new ForbiddenException(
      'You can view only your own check-in',
    );
  }

  const checkIn = await this.checkInRepo.findOne({
    where: {
      appointment: {
        id: appointmentId,
      },
    },
  });

  return checkIn || null;
  }

   async getForDoctor(appointmentId: number, doctorId: string) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
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
        'You can view check-in only for your own appointment',
      );
    }

    const checkIn = await this.checkInRepo.findOne({
      where: {
        appointment: { id: appointmentId },
      },
    });

    return checkIn || null;
  }
}


