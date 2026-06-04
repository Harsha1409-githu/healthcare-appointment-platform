import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hospital } from '../hospital/hospital.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';
import { Appointment } from '../appointment/appointment.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  login(email: string, password: string) {
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new UnauthorizedException(
        'Invalid admin credentials',
      );
    }

    const payload = {
      sub: 'admin',
      email,
      role: 'admin',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email,
        role: 'admin',
        name: 'Admin',
      },
    };
  }

  async getDashboardStats() {
    const [
      hospitals,
      doctors,
      patients,
      appointments,
    ] = await Promise.all([
      this.hospitalRepo.count(),
      this.doctorRepo.count(),
      this.patientRepo.count(),
      this.appointmentRepo.count(),
    ]);

    return {
      hospitals,
      doctors,
      patients,
      appointments,
    };
  }

  async getHospitals() {
    return this.hospitalRepo.find({
      order: {
        hospitalName: 'ASC',
      },
    });
  }

  async approveHospital(id: string) {
    const hospital = await this.hospitalRepo.findOne({
      where: { id },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    hospital.isApproved = true;
    hospital.status = 'APPROVED';

    await this.hospitalRepo.save(hospital);

    return {
      message: 'Hospital approved successfully',
      hospital,
    };
  }

  async rejectHospital(id: string) {
    const hospital = await this.hospitalRepo.findOne({
      where: { id },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    hospital.isApproved = false;
    hospital.status = 'REJECTED';

    await this.hospitalRepo.save(hospital);

    return {
      message: 'Hospital rejected successfully',
      hospital,
    };
  }

  async getDoctors() {
    return this.doctorRepo.find({
      relations: {
        hospital: true,
      },
      order: {
        doctorName: 'ASC',
      },
    });
  }

  async activateDoctor(id: string) {
    const doctor = await this.doctorRepo.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    doctor.isActive = true;

    await this.doctorRepo.save(doctor);

    return {
      message: 'Doctor activated successfully',
    };
  }

  async deactivateDoctor(id: string) {
    const doctor = await this.doctorRepo.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    doctor.isActive = false;

    await this.doctorRepo.save(doctor);

    return {
      message: 'Doctor deactivated successfully',
    };
  }
}