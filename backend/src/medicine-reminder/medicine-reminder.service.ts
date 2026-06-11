import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MedicineReminder } from './medicine-reminder.entity';

@Injectable()
export class MedicineReminderService {
  constructor(
    @InjectRepository(MedicineReminder)
    private reminderRepo: Repository<MedicineReminder>,
  ) {}

  create(data: Partial<MedicineReminder>) {
    const reminder = this.reminderRepo.create(data);
    return this.reminderRepo.save(reminder);
  }

  findByPatient(patientId: string) {
    return this.reminderRepo.find({
      where: {
        patientId,
        isActive: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}