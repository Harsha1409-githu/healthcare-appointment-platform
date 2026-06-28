import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FamilyMember } from './family-member.entity';
import { Patient } from '../patient/patient.entity';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';

@Injectable()
export class FamilyMemberService {
  constructor(
    @InjectRepository(FamilyMember)
    private familyMemberRepo: Repository<FamilyMember>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async create(dto: CreateFamilyMemberDto) {
    const patient = await this.patientRepo.findOne({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const member = this.familyMemberRepo.create({
      fullName: dto.fullName,
      relation: dto.relation || 'OTHER',
      gender: dto.gender,
      age: dto.age,
      bloodGroup: dto.bloodGroup,
      mobile: dto.mobile,
      profileImage: dto.profileImage,
      patient,
    });

    return this.familyMemberRepo.save(member);
  }

  async findByPatient(patientId: string) {
    return this.familyMemberRepo.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      relations: {
        patient: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const member = await this.familyMemberRepo.findOne({
      where: { id },
      relations: {
        patient: true,
      },
    });

    if (!member) {
      throw new NotFoundException('Family member not found');
    }

    return member;
  }

  async update(id: string, dto: UpdateFamilyMemberDto) {
    const member = await this.findOne(id);

    Object.assign(member, dto);

    return this.familyMemberRepo.save(member);
  }

  async delete(id: string) {
    const member = await this.findOne(id);

    await this.familyMemberRepo.remove(member);

    return {
      message: 'Family member deleted',
    };
  }
}