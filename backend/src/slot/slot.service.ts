import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DoctorAvailability } from '../availability/doctor-availability.entity';
import { Slot, SlotType } from './slot.entity';
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

    const normalizedDate = new Date(date).toISOString().split('T')[0];

    const existingSlots = await this.slotRepo.find({
      where: {
        doctor: { id: doctorId },
        date: normalizedDate,
      },
    });

    const existingKeys = new Set(
      existingSlots.map((slot) => `${slot.date}-${slot.startTime}`),
    );

    const slotsToCreate: Slot[] = [];

    for (const rule of availability) {
      const finalSlotType = rule.slotType || SlotType.BOTH;

      let current = this.toMinutes(rule.startTime);
      const end = this.toMinutes(rule.endTime);
      const duration = Number(rule.slotDuration ?? 30);

      while (current + duration <= end) {
        const startTime = this.toTime(current);
        const endTime = this.toTime(current + duration);
        const key = `${normalizedDate}-${startTime}`;

        if (!existingKeys.has(key)) {
          existingKeys.add(key);

          slotsToCreate.push(
            this.slotRepo.create({
              doctor,
              date: normalizedDate,
              startTime,
              endTime,
              slotType: finalSlotType,
              isAvailable: true,
            }),
          );
        }

        current += duration;
      }
    }

    if (!slotsToCreate.length) {
      return {
        message: 'Slots already generated',
        count: existingSlots.length,
      };
    }

    return this.slotRepo.save(slotsToCreate);
  }

  async getSlotsByDoctor(doctorId: string) {
    return this.slotRepo.find({
      where: {
        doctor: { id: doctorId },
      },
      relations: {
        doctor: true,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async getAvailableSlots(doctorId: string, appointmentType?: SlotType) {
    const slots = await this.slotRepo.find({
      where: {
        doctor: { id: doctorId },
        isAvailable: true,
      },
      relations: {
        doctor: true,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    const now = new Date();
    const uniqueSlots = new Map<string, Slot>();

    for (const slot of slots) {
      const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);

      if (slotDateTime <= now) continue;

      if (
        slot.doctor?.liveStatus === 'BREAK' &&
        slot.doctor?.blockedUntil &&
        slotDateTime < new Date(slot.doctor.blockedUntil)
      ) {
        continue;
      }

      if (
        appointmentType &&
        appointmentType !== SlotType.BOTH &&
        slot.slotType !== appointmentType &&
        slot.slotType !== SlotType.BOTH
      ) {
        continue;
      }

      const key = `${slot.date}-${slot.startTime}`;

      if (!uniqueSlots.has(key)) {
        uniqueSlots.set(key, slot);
      }
    }

    return Array.from(uniqueSlots.values());
  }

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