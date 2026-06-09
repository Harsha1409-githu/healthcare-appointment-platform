import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Doctor } from './doctor.entity';
import { Hospital } from '../hospital/hospital.entity';
import { SearchDoctorDto } from './dto/search-doctor.dto';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';


@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,

    private readonly jwtService: JwtService,
  ) {}

  async doctorLogin(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException(
        'Email and password are required',
      );
    }

    const doctor = await this.doctorRepository.findOne({
      where: {
        email,
        isActive: true,
      },
      relations: {
        hospital: true,
      },
    });

    if (!doctor || !doctor.password) {
      throw new UnauthorizedException(
        'Invalid doctor credentials',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      doctor.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid doctor credentials',
      );
    }

    const payload = {
      sub: doctor.id,
      email: doctor.email,
      role: 'doctor',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: doctor.id,
        doctorName: doctor.doctorName,
        email: doctor.email,
        role: 'doctor',
        specialization: doctor.specialization,
        hospitalName: doctor.hospital?.hospitalName,
      },
    };
  }

  async createDoctor(data: any) {
    const hospital = await this.hospitalRepository.findOne({
      where: { id: data.hospitalId },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    if (!data.password) {
      throw new BadRequestException(
        'Doctor password is required',
      );
    }

    const existingDoctor =
      await this.doctorRepository.findOne({
        where: { email: data.email },
      });

    if (existingDoctor) {
      throw new BadRequestException(
        'Doctor already exists with this email',
      );
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      10,
    );

    const doctor = this.doctorRepository.create({
      doctorName: data.doctorName,
      specialization: data.specialization,
      experience: data.experience,
      qualification: data.qualification,
      consultationFee: data.consultationFee,
      mobile: data.mobile,
      email: data.email,
      password: hashedPassword,
      city: data.city || hospital.city,
      state: data.state || hospital.state,
      hospital,
    });

    return this.doctorRepository.save(doctor);
  }

  async getDoctors() {
    return this.doctorRepository.find({
      relations: {
        hospital: true,
      },
    });
  }

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

  async reactivateDoctor(id: string) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    doctor.isActive = true;

    await this.doctorRepository.save(doctor);

    return {
      message: 'Doctor reactivated successfully',
    };
  }

  async searchDoctors(query: SearchDoctorDto) {
    const qb =
      this.doctorRepository.createQueryBuilder('doctor');

    if (query.city) {
      qb.andWhere(
        'LOWER(doctor.city) LIKE LOWER(:city)',
        {
          city: `%${query.city}%`,
        },
      );
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
  async getDoctorProfile(doctorId: string) {
  const doctor = await this.doctorRepository.findOne({
    where: { id: doctorId },
    relations: {
      hospital: true,
    },
  });

  if (!doctor) {
    throw new NotFoundException('Doctor not found');
  }

  return doctor;
}

async updateDoctorProfile(
  doctorId: string,
  data: any,
) {
  const doctor = await this.doctorRepository.findOne({
    where: { id: doctorId },
  });

  if (!doctor) {
    throw new NotFoundException('Doctor not found');
  }

  doctor.doctorName =
    data.doctorName ?? doctor.doctorName;

  doctor.specialization =
    data.specialization ??
    doctor.specialization;

  doctor.qualification =
    data.qualification ??
    doctor.qualification;

  doctor.experience =
    data.experience ?? doctor.experience;

  doctor.consultationFee =
    data.consultationFee ??
    doctor.consultationFee;

  doctor.mobile =
    data.mobile ?? doctor.mobile;

  doctor.city =
    data.city ?? doctor.city;

  doctor.state =
    data.state ?? doctor.state;

  return this.doctorRepository.save(doctor);
}
async changePassword(
  doctorId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (!currentPassword || !newPassword) {
    throw new BadRequestException(
      'Current password and new password are required',
    );
  }

  const doctor = await this.doctorRepository.findOne({
    where: {
      id: doctorId,
    },
  });

  if (!doctor) {
    throw new NotFoundException('Doctor not found');
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    doctor.password,
  );

  if (!isMatch) {
    throw new BadRequestException(
      'Current password is incorrect',
    );
  }

  doctor.password = await bcrypt.hash(newPassword, 10);

  await this.doctorRepository.save(doctor);

  return {
    message: 'Password changed successfully',
  };
}
async uploadDoctorPhoto(
  doctorId: string,
  file: Express.Multer.File,
) {
  const doctor = await this.doctorRepository.findOne({
    where: { id: doctorId },
    relations: {
      hospital: true,
    },
  });

  if (!doctor) {
    throw new NotFoundException('Doctor not found');
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

  const imageUrl = await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'doctors',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

  doctor.profileImage = imageUrl;

  const updatedDoctor = await this.doctorRepository.save(doctor);

  return updatedDoctor;
}
}