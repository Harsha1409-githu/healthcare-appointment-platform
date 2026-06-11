import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SymptomHistory } from './symptom-history.entity';
import { Patient } from '../patient/patient.entity';

@Injectable()
export class SymptomHistoryService {
  constructor(
    @InjectRepository(SymptomHistory)
    private symptomHistoryRepo: Repository<SymptomHistory>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async create(
    patientId: string,
    data: {
      symptoms: string;
      condition: string;
      specialization: string;
      advice: string;
      urgent?: boolean;
    },
  ) {
    const patient = await this.patientRepo.findOne({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const history = this.symptomHistoryRepo.create({
      symptoms: data.symptoms,
      condition: data.condition,
      specialization: data.specialization,
      advice: data.advice,
      urgent: data.urgent || false,
      patient,
    });

    return this.symptomHistoryRepo.save(history);
  }

  async getMyHistory(patientId: string) {
    const patient = await this.patientRepo.findOne({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.symptomHistoryRepo
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.patient', 'patient')
      .where('patient.id = :patientId', { patientId })
      .orderBy('history.createdAt', 'DESC')
      .getMany();
  }
}