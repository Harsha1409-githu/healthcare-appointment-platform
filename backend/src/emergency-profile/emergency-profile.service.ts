import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmergencyProfile } from './emergency-profile.entity';
import { Patient } from '../patient/patient.entity';
import { FamilyMember } from '../family-member/family-member.entity';
import { UpsertEmergencyProfileDto } from './dto/upsert-emergency-profile.dto';

@Injectable()
export class EmergencyProfileService {
  constructor(
    @InjectRepository(EmergencyProfile)
    private emergencyProfileRepo: Repository<EmergencyProfile>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    @InjectRepository(FamilyMember)
    private familyMemberRepo: Repository<FamilyMember>,
  ) {}

  async getByPatient(patientId: string) {
    return this.emergencyProfileRepo.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      relations: {
        patient: true,
        familyMember: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async getSelectedProfile(
    patientId: string,
    familyMemberId?: string,
  ) {
    if (familyMemberId) {
      return this.emergencyProfileRepo.findOne({
        where: {
          patient: { id: patientId },
          familyMember: { id: familyMemberId },
        },
        relations: {
          patient: true,
          familyMember: true,
        },
      });
    }

    const profiles = await this.emergencyProfileRepo.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      relations: {
        patient: true,
        familyMember: true,
      },
    });

    return profiles.find((item) => !item.familyMember) || null;
  }

  async upsert(dto: UpsertEmergencyProfileDto) {
    const patient = await this.patientRepo.findOne({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    let familyMember: FamilyMember | null = null;

    if (dto.familyMemberId) {
      familyMember = await this.familyMemberRepo.findOne({
        where: {
          id: dto.familyMemberId,
          patient: { id: patient.id },
        },
        relations: {
          patient: true,
        },
      });

      if (!familyMember) {
        throw new NotFoundException('Family member not found');
      }
    }

    let profile = await this.getSelectedProfile(
      patient.id,
      familyMember?.id,
    );

    if (!profile) {
      profile = this.emergencyProfileRepo.create({
        patient,
        familyMember,
      } as Partial<EmergencyProfile>);
    }

    Object.assign(profile, {
      bloodGroup: dto.bloodGroup,
      allergies: dto.allergies,
      chronicDiseases: dto.chronicDiseases,
      currentMedications: dto.currentMedications,
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
      insuranceNumber: dto.insuranceNumber,
      organDonor: dto.organDonor ?? false,
    });

    return this.emergencyProfileRepo.save(profile);
  }
}