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

  async createAvailability(dto: CreateAvailabilityDto) {
    this.validateAvailability(dto);

    const doctor = await this.doctorRepo.findOne({
      where: { id: dto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const existing = await this.availabilityRepo.findOne({
      where: {
        doctor: { id: dto.doctorId },
        dayOfWeek: dto.dayOfWeek,
      },
      relations: {
        doctor: true,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Availability already exists for this doctor and day. Please update it instead.',
      );
    }

    const availability = this.availabilityRepo.create({
      doctor,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
      slotDuration: Number(dto.slotDuration ?? 30),
    });

    return this.availabilityRepo.save(availability);
  }

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
      order: {
        dayOfWeek: 'ASC',
      },
    });
  }

  async updateAvailability(
    id: string,
    dto: Partial<CreateAvailabilityDto>,
  ) {
    const availability =
      await this.availabilityRepo.findOne({
        where: { id },
        relations: {
          doctor: true,
        },
      });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    const updatedData = {
      doctorId: availability.doctor.id,
      dayOfWeek: dto.dayOfWeek ?? availability.dayOfWeek,
      startTime: dto.startTime ?? availability.startTime,
      endTime: dto.endTime ?? availability.endTime,
      slotDuration:
        dto.slotDuration ?? availability.slotDuration,
    };

    this.validateAvailability(updatedData);

    availability.dayOfWeek = updatedData.dayOfWeek;
    availability.startTime = updatedData.startTime;
    availability.endTime = updatedData.endTime;
    availability.slotDuration = Number(
      updatedData.slotDuration,
    );

    return this.availabilityRepo.save(availability);
  }

  async deleteAvailability(id: string) {
    const availability =
      await this.availabilityRepo.findOne({
        where: { id },
      });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    await this.availabilityRepo.delete(id);

    return {
      message: 'Availability deleted successfully',
    };
  }

  private validateAvailability(dto: Partial<CreateAvailabilityDto>) {
    if (!dto.doctorId) {
      throw new BadRequestException('doctorId is required');
    }

    if (!dto.dayOfWeek || !dto.startTime || !dto.endTime) {
      throw new BadRequestException(
        'dayOfWeek, startTime and endTime are required',
      );
    }

    const start = this.toMinutes(dto.startTime);
    const end = this.toMinutes(dto.endTime);

    if (start >= end) {
      throw new BadRequestException(
        'Start time must be before end time',
      );
    }

    const duration = Number(dto.slotDuration ?? 30);

    if (duration <= 0) {
      throw new BadRequestException(
        'Slot duration must be greater than 0',
      );
    }

    if (duration > end - start) {
      throw new BadRequestException(
        'Slot duration cannot be longer than availability window',
      );
    }
  }

  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }
}