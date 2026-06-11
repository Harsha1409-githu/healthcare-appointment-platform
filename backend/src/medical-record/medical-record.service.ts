import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MedicalRecord } from './medical-record.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';

import { Patient } from '../patient/patient.entity';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepo: Repository<MedicalRecord>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async create(
    patientId: string,
    dto: CreateMedicalRecordDto,
  ) {
    const patient = await this.patientRepo.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const record = this.medicalRecordRepo.create({
      title: dto.title,
      recordType: dto.recordType,
      fileUrl: dto.fileUrl,
      fileName: dto.fileName,
      patient,
    });

    return this.medicalRecordRepo.save(record);
  }

  async getMyRecords(patientId: string) {
    return this.medicalRecordRepo.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      order: {
        uploadedAt: 'DESC',
      },
    });
  }

  async deleteRecord(id: number, patientId: string) {
    const record = await this.medicalRecordRepo.findOne({
      where: {
        id,
        patient: {
          id: patientId,
        },
      },
    });

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    await this.medicalRecordRepo.remove(record);

    return {
      message: 'Medical record deleted successfully',
    };
  }
}