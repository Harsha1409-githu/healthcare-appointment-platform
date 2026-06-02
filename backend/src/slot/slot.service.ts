import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DoctorAvailability } from '../availability/doctor-availability.entity';
import { Slot } from './slot.entity';
import { Doctor } from '../doctor/doctor.entity';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(DoctorAvailability)
    private availabilityRepo: Repository<DoctorAvailability>,

    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  // =========================
  // GENERATE SLOTS
  // =========================
  async generateSlotsForDoctor(doctorId: string, date: string) {
    const doctor = await this.doctorRepo.findOne({
      where: { id: doctorId },
    });

    if (!doctor) throw new NotFoundException('Doctor not found');

    const availability = await this.availabilityRepo.find({
      where: { doctor: { id: doctorId } },
    });

    if (!availability.length) {
      throw new NotFoundException('No availability found');
    }

    const normalizedDate = new Date(date)
      .toISOString()
      .split('T')[0]; // YYYY-MM-DD

    const existingSlots = await this.slotRepo.find({
      where: {
        doctor: { id: doctorId },
        date: normalizedDate,
      },
    });

    if (existingSlots.length > 0) {
      return {
        message: 'Slots already generated',
        count: existingSlots.length,
      };
    }

    const slotsToCreate: Slot[] = [];

    for (const rule of availability) {
      let current = this.toMinutes(rule.startTime);
      const end = this.toMinutes(rule.endTime);
      const duration = Number(rule.slotDuration ?? 30);

      while (current + duration <= end) {
        slotsToCreate.push(
          this.slotRepo.create({
            doctor,
            date: normalizedDate,
            startTime: this.toTime(current),
            endTime: this.toTime(current + duration),
            isAvailable: true,
          }),
        );

        current += duration;
      }
    }

    return this.slotRepo.save(slotsToCreate);
  }

  // =========================
  // GET SLOTS BY DOCTOR
  // =========================
  async getSlotsByDoctor(doctorId: string) {
    return this.slotRepo.find({
      where: {
        doctor: { id: doctorId },
      },
      relations: {
        doctor: true,
      },
    });
  }

  // =========================
  // GET AVAILABLE SLOTS
  // =========================
  async getAvailableSlots(doctorId: string) {
    return this.slotRepo.find({
      where: {
        doctor: { id: doctorId },
        isAvailable: true,
      },
      relations: {
        doctor: true,
      },
    });
  }

  // =========================
  // HELPERS
  // =========================
  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private toTime(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${this.pad(h)}:${this.pad(m)}`;
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}