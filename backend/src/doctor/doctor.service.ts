import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from './doctor.entity';
import { Hospital } from '../hospital/hospital.entity';
import { SearchDoctorDto } from './dto/search-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,

    
  ) {}

  // =========================
  // CREATE DOCTOR
  // =========================
  async createDoctor(data: any) {
    const hospital = await this.hospitalRepository.findOne({
      where: { id: data.hospitalId },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    const doctor = this.doctorRepository.create({
      doctorName: data.doctorName,
      specialization: data.specialization,
      experience: data.experience,
      qualification: data.qualification,
      consultationFee: data.consultationFee,
      mobile: data.mobile,
      email: data.email,
      city: data.city || hospital.city,
      state: data.state || hospital.state,
      hospital,
    });

    return this.doctorRepository.save(doctor);
  }

  // =========================
  // GET ALL DOCTORS
  // =========================
  async getDoctors() {
    return this.doctorRepository.find({
      relations: {
        hospital: true,
      },
    });
  }

  // =========================
  // GET DOCTOR BY ID
  // =========================
  async getDoctorById(id: string) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: {
        hospital: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }
// =========================
// SOFT DELETE DOCTOR
// =========================
async deleteDoctor(id: string) {
  const doctor = await this.doctorRepository.findOne({
    where: { id },
  });

  if (!doctor) {
    throw new NotFoundException('Doctor not found');
  }

  doctor.isActive = false;

  await this.doctorRepository.save(doctor);

  return {
    message: 'Doctor deactivated successfully',
  };
}
  // =========================
  // SEARCH DOCTORS (PRACTO STYLE)
  // =========================
  async searchDoctors(query: SearchDoctorDto) {
    const qb = this.doctorRepository.createQueryBuilder('doctor');

    if (query.city) {
      qb.andWhere('LOWER(doctor.city) LIKE LOWER(:city)', {
        city: `%${query.city}%`,
      });
    }

    if (query.specialization) {
      qb.andWhere(
        'LOWER(doctor.specialization) LIKE LOWER(:specialization)',
        {
          specialization: `%${query.specialization}%`,
        },
      );
    }

    if (query.minExperience) {
      qb.andWhere('doctor.experience >= :minExp', {
        minExp: query.minExperience,
      });
    }

    if (query.maxExperience) {
      qb.andWhere('doctor.experience <= :maxExp', {
        maxExp: query.maxExperience,
      });
    }

    if (query.minFee) {
      qb.andWhere('doctor.consultationFee >= :minFee', {
        minFee: query.minFee,
      });
    }

    if (query.maxFee) {
      qb.andWhere('doctor.consultationFee <= :maxFee', {
        maxFee: query.maxFee,
      });
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    qb.skip(skip).take(limit);

    qb.orderBy('doctor.experience', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}