import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Patient } from '../patient/patient.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
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
      where: [
        { email: data.email },
        { mobile: data.mobile },
      ],
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

    const payload = {
      sub: savedPatient.id,
      email: savedPatient.email,
      role: 'patient',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedPatient.id,
        fullName: savedPatient.fullName,
        email: savedPatient.email,
        mobile: savedPatient.mobile,
        role: 'patient',
      },
    };
  }

  async login(email: string, password: string) {
    const patient = await this.patientRepository.findOne({
      where: { email },
    });

    if (!patient) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(
      password,
      patient.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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
}