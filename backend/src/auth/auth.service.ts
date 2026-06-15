import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Patient } from '../patient/patient.entity';
import { Hospital } from '../hospital/hospital.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
  ) {}

  async register(data: {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
    gender?: string;
    age?: number;
    city?: string;
  }) {
    const existingPatient = await this.patientRepository.findOne({
      where: [{ email: data.email }, { mobile: data.mobile }],
    });

    if (existingPatient) {
      throw new ConflictException(
        'Patient already exists with this email or mobile',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const patient = this.patientRepository.create({
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      password: hashedPassword,
      gender: data.gender,
      age: data.age,
      city: data.city,
    });

    const savedPatient = await this.patientRepository.save(patient);

    return this.createPatientTokenResponse(savedPatient);
  }

  async login(email: string, password: string) {
    const patient = await this.patientRepository.findOne({
      where: { email },
    });

    if (!patient) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, patient.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createPatientTokenResponse(patient);
  }

  // DEV OTP SEND
  async sendPatientOtp(mobile: string) {
    if (!mobile || mobile.length !== 10) {
      throw new BadRequestException('Valid mobile number is required');
    }

    return {
      message: 'OTP sent successfully',
      otp: '123456',
    };
  }

  // DEV OTP VERIFY + REAL PATIENT + REAL JWT
  async verifyPatientOtp(mobile: string, otp: string) {
    if (!mobile || mobile.length !== 10) {
      throw new BadRequestException('Valid mobile number is required');
    }

    if (otp !== '123456') {
      throw new UnauthorizedException('Invalid OTP');
    }

    let patient = await this.patientRepository.findOne({
      where: { mobile },
    });

    if (!patient) {
      const defaultEmail = `${mobile}@medicare.local`;
      const defaultPassword = await bcrypt.hash(`otp-${mobile}`, 10);

      patient = this.patientRepository.create({
        fullName: 'Patient',
        mobile,
        email: defaultEmail,
        password: defaultPassword,
        isActive: true,
      });

      patient = await this.patientRepository.save(patient);
    }

    return this.createPatientTokenResponse(patient);
  }

  private createPatientTokenResponse(patient: Patient) {
    const payload = {
      sub: patient.id,
      email: patient.email,
      role: 'patient',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: patient.id,
        fullName: patient.fullName,
        email: patient.email,
        mobile: patient.mobile,
        role: 'patient',
      },
    };
  }

  async hospitalLogin(email: string, password: string) {
    const hospital = await this.hospitalRepository.findOne({
      where: { email },
    });

    if (!hospital) {
      throw new UnauthorizedException('Invalid hospital credentials');
    }

    let isValid = false;

    if (hospital.password?.startsWith('$2b$')) {
      isValid = await bcrypt.compare(password, hospital.password);
    } else {
      isValid = password === hospital.password;
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid hospital credentials');
    }

    if (!hospital.isApproved) {
      throw new UnauthorizedException(
        'Hospital approval is pending. Please contact admin.',
      );
    }

    const payload = {
      sub: hospital.id,
      email: hospital.email,
      role: 'hospital',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: hospital.id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        mobile: hospital.mobile,
        city: hospital.city,
        role: 'hospital',
      },
    };
  }
}