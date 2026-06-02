import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DoctorAvailability } from './doctor-availability.entity';
import { Doctor } from '../doctor/doctor.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(DoctorAvailability)
    private availabilityRepo: Repository<DoctorAvailability>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  // =========================
  // CREATE AVAILABILITY
  // =========================
  async createAvailability(dto: CreateAvailabilityDto) {
    if (!dto?.doctorId) {
      throw new BadRequestException('doctorId is required');
    }

    if (!dto?.dayOfWeek || !dto?.startTime || !dto?.endTime) {
      throw new BadRequestException('Invalid availability data');
    }

    const doctor = await this.doctorRepo.findOne({
      where: { id: dto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const availability = this.availabilityRepo.create({
      doctor: { id: doctor.id }, // ✅ FIX: relation-safe mapping
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
      slotDuration: dto.slotDuration ?? 15, // ✅ default fallback
    });

    return this.availabilityRepo.save(availability);
  }

  // =========================
  // GET AVAILABILITY BY DOCTOR
  // =========================
  async getAvailabilityByDoctor(doctorId: string) {
    if (!doctorId) {
      throw new BadRequestException('doctorId is required');
    }

    return this.availabilityRepo.find({
      where: {
        doctor: { id: doctorId },
      },
      relations: {
        doctor: true,
      },
    });
  }
}