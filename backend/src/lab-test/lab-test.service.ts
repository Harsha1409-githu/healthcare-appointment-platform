import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LabTest, LabTestStatus } from './lab-test.entity';

@Injectable()
export class LabTestService {
  constructor(
    @InjectRepository(LabTest)
    private labTestRepo: Repository<LabTest>,
  ) {}

  create(data: Partial<LabTest>) {
    const booking = this.labTestRepo.create(data);
    return this.labTestRepo.save(booking);
  }

  findByPatient(patientId: string) {
    return this.labTestRepo.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }

  async cancel(id: string) {
    const booking = await this.labTestRepo.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Lab test booking not found');
    }

    booking.status = LabTestStatus.CANCELLED;

    return this.labTestRepo.save(booking);
  }
}