import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Slot } from './slot.entity';
import { Doctor } from '../doctor/doctor.entity';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  async getSlotsByDoctor(doctorId: string) {
    const doctor = await this.doctorRepo.findOne({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.slotRepo.find({
      where: { doctor: { id: doctorId } },
      relations: { doctor: true },
    });
  }

  async getAvailableSlots(doctorId: string) {
    return this.slotRepo.find({
      where: {
        doctor: { id: doctorId },
        isAvailable: true,
      },
      relations: { doctor: true },
    });
  }
}