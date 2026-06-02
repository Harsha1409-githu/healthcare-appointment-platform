import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  // ✅ REGISTER PATIENT
  async register(dto: CreatePatientDto) {
    if (!dto?.email || !dto?.mobile) {
      throw new BadRequestException('email and mobile are required');
    }

    const existing = await this.patientRepo.findOne({
      where: [
        { email: dto.email },
        { mobile: dto.mobile },
      ],
    });

    if (existing) {
      throw new BadRequestException('Patient already exists');
    }

    const patient = this.patientRepo.create(dto);
    return this.patientRepo.save(patient);
  }

  // ✅ ADD THIS (FIX)
  async findAll() {
    return this.patientRepo.find();
  }
}