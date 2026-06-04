import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Hospital } from './hospital.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Slot } from '../slot/slot.entity';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
  ) {}

  async getAllHospitals() {
    return this.hospitalRepository.find();
  }

  async registerHospital(data: Partial<Hospital>) {
    const hashedPassword = await bcrypt.hash(
      data.password!,
      10,
    );

    const hospital = this.hospitalRepository.create({
      ...data,
      password: hashedPassword,
    });

    const savedHospital =
      await this.hospitalRepository.save(hospital);

    const { password, ...result } = savedHospital;

    return result;
  }

  async getMyDoctors(hospitalId: string) {
    return this.doctorRepository.find({
      where: {
        hospital: {
          id: hospitalId,
        },
      },
      relations: {
        hospital: true,
      },
      order: {
        doctorName: 'ASC',
      },
    });
  }

  async getDashboard(hospitalId: string) {
    const doctors = await this.doctorRepository.find({
      where: {
        hospital: {
          id: hospitalId,
        },
      },
    });

    const doctorIds = doctors.map((doctor) => doctor.id);

    if (doctorIds.length === 0) {
      return {
        totalDoctors: 0,
        activeDoctors: 0,
        appointments: 0,
        completed: 0,
        cancelled: 0,
        pending: 0,
        slots: 0,
      };
    }

    const appointments =
      await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.doctor', 'doctor')
        .where('doctor.id IN (:...doctorIds)', {
          doctorIds,
        })
        .getMany();

    const slots =
      await this.slotRepository
        .createQueryBuilder('slot')
        .leftJoinAndSelect('slot.doctor', 'doctor')
        .where('doctor.id IN (:...doctorIds)', {
          doctorIds,
        })
        .getCount();

    return {
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter((d) => d.isActive).length,
      appointments: appointments.length,
      completed: appointments.filter(
        (a) => a.status === 'COMPLETED',
      ).length,
      cancelled: appointments.filter(
        (a) => a.status === 'CANCELLED',
      ).length,
      pending: appointments.filter(
        (a) => a.status === 'BOOKED',
      ).length,
      slots,
    };
  }
}