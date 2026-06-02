import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Appointment, AppointmentStatus } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Doctor } from '../doctor/doctor.entity';
import { Slot } from '../slot/slot.entity';
import { Patient } from '../patient/patient.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    private dataSource: DataSource,

    private readonly mailService: MailService,
  ) {}

  async bookAppointment(
    dto: CreateAppointmentDto,
    patientId: string,
  ) {
    if (!dto?.doctorId)
      throw new BadRequestException('doctorId is required');

    if (!dto?.slotId)
      throw new BadRequestException('slotId is required');

    if (!dto?.patientName)
      throw new BadRequestException('patientName is required');

    if (!dto?.patientPhone)
      throw new BadRequestException('patientPhone is required');

    if (!patientId)
      throw new BadRequestException('patientId is required');

    return await this.dataSource.transaction(async (manager) => {
      const doctor = await manager.findOne(Doctor, {
        where: { id: dto.doctorId },
        relations: {
          hospital: true,
        },
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      const patient = await manager.findOne(Patient, {
        where: { id: patientId },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const slot = await manager.findOne(Slot, {
        where: { id: dto.slotId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!slot) {
        throw new NotFoundException('Slot not found');
      }

      if (!slot.isAvailable) {
        throw new BadRequestException('Slot already booked');
      }

      slot.isAvailable = false;
      await manager.save(Slot, slot);

      const appointment = manager.create(Appointment, {
        doctor,
        slot,
        patient,
        patientName: dto.patientName,
        patientPhone: dto.patientPhone,
        status: AppointmentStatus.BOOKED,
      });

      const savedAppointment = await manager.save(
        Appointment,
        appointment,
      );

      try {
  await this.mailService.sendAppointmentConfirmation({
    to: patient.email,
    patientName: patient.fullName,
    doctorName: doctor.doctorName,
    specialization: doctor.specialization,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    hospitalName:
      doctor.hospital?.hospitalName || 'MediCare Hospital',
    fee: doctor.consultationFee,
  });
} catch (mailError) {
  console.error('Email sending failed:', mailError);
}

return savedAppointment;
    });
  }

  async getAllAppointments() {
    return this.appointmentRepo.find({
      relations: {
        doctor: true,
        slot: true,
        patient: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getMyAppointments(patientId: string) {
    if (!patientId) {
      throw new BadRequestException('patientId is required');
    }

    return this.appointmentRepo.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      relations: {
        doctor: true,
        slot: true,
        patient: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getAppointmentsByDoctor(doctorId: string) {
    if (!doctorId) {
      throw new BadRequestException('doctorId is required');
    }

    return this.appointmentRepo.find({
      where: {
        doctor: { id: doctorId },
      },
      relations: {
        doctor: true,
        slot: true,
        patient: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async cancelAppointment(id: number, patientId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const appointment = await manager.findOne(Appointment, {
        where: { id },
        relations: {
          slot: true,
          patient: true,
        },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (appointment.patient?.id !== patientId) {
        throw new ForbiddenException(
          'You can cancel only your own appointment',
        );
      }

      if (appointment.status === AppointmentStatus.CANCELLED) {
        throw new BadRequestException(
          'Appointment already cancelled',
        );
      }

      appointment.status = AppointmentStatus.CANCELLED;

      appointment.slot.isAvailable = true;
      await manager.save(Slot, appointment.slot);

      return await manager.save(Appointment, appointment);
    });
  }

  async completeAppointment(id: number) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: {
        doctor: true,
        slot: true,
        patient: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException(
        'Cancelled appointment cannot be completed',
      );
    }

    appointment.status = AppointmentStatus.COMPLETED;

    return this.appointmentRepo.save(appointment);
  }
}