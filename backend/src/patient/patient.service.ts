import * as bcrypt from 'bcrypt';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async register(dto: CreatePatientDto) {
    if (!dto?.email || !dto?.mobile) {
      throw new BadRequestException(
        'email and mobile are required',
      );
    }

    const existing = await this.patientRepo.findOne({
      where: [
        { email: dto.email },
        { mobile: dto.mobile },
      ],
    });

    if (existing) {
      throw new BadRequestException(
        'Patient already exists',
      );
    }

    const patient = this.patientRepo.create(dto);

    return this.patientRepo.save(patient);
  }

  async findAll() {
    return this.patientRepo.find();
  }

  async getProfile(patientId: string) {
    const patient = await this.patientRepo.findOne({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const { password, ...result } = patient;

    return result;
  }

  async updateProfile(patientId: string, data: any) {
    const patient = await this.patientRepo.findOne({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    patient.fullName = data.fullName ?? patient.fullName;
    patient.mobile = data.mobile ?? patient.mobile;
    patient.gender = data.gender ?? patient.gender;
    patient.age = data.age ?? patient.age;
    patient.city = data.city ?? patient.city;

    const updatedPatient =
      await this.patientRepo.save(patient);

    const { password, ...result } = updatedPatient;

    return result;
  }
  async changePassword(
  patientId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (!currentPassword || !newPassword) {
    throw new BadRequestException(
      'Current password and new password are required',
    );
  }

  const patient = await this.patientRepo.findOne({
    where: {
      id: patientId,
    },
  });

  if (!patient) {
    throw new NotFoundException('Patient not found');
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    patient.password,
  );

  if (!isMatch) {
    throw new BadRequestException(
      'Current password is incorrect',
    );
  }

  patient.password = await bcrypt.hash(newPassword, 10);

  await this.patientRepo.save(patient);

  return {
    message: 'Password changed successfully',
  };
}

async uploadProfilePhoto(
  
  patientId: string,
  file: Express.Multer.File,
  
) {
  const patient = await this.patientRepo.findOne({
    where: { id: patientId },
  });

  if (!patient) {
    throw new NotFoundException('Patient not found');
  }
if (!file) {
  throw new BadRequestException('File is required');
}

if (!file.buffer) {
  throw new BadRequestException('File buffer missing');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

  const imageUrl = await new Promise<string>(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: 'patients',
          },
          (error, result) => {
            if (error) return reject(error);

            resolve(result!.secure_url);
          },
        );

      Readable.from(file.buffer).pipe(
        uploadStream,
      );
    },
  );

  patient.profileImage = imageUrl;

  await this.patientRepo.save(patient);

  return {
    profileImage: imageUrl,
  };
}
}