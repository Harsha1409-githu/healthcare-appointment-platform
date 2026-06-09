import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Hospital } from './hospital.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Slot } from '../slot/slot.entity';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { MailService } from '../mail/mail.service';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
    private readonly mailService: MailService,
  ) {}

  async getAllHospitals() {
    return this.hospitalRepository.find();
  }

  async registerHospital(data: Partial<Hospital>) {
    const hashedPassword = await bcrypt.hash(
      data.password!,
      10,
    );

    const hospital = this.hospitalRepository.create({
      ...data,
      password: hashedPassword,
    });

    const savedHospital =
      await this.hospitalRepository.save(hospital);

    const { password, ...result } = savedHospital;

    return result;
  }

  async getMyDoctors(hospitalId: string) {
    return this.doctorRepository.find({
      where: {
        hospital: {
          id: hospitalId,
        },
      },
      relations: {
        hospital: true,
      },
      order: {
        doctorName: 'ASC',
      },
    });
  }

  async getDashboard(hospitalId: string) {
    const doctors = await this.doctorRepository.find({
      where: {
        hospital: {
          id: hospitalId,
        },
      },
    });

    const doctorIds = doctors.map((doctor) => doctor.id);

    if (doctorIds.length === 0) {
      return {
        totalDoctors: 0,
        activeDoctors: 0,
        appointments: 0,
        completed: 0,
        cancelled: 0,
        pending: 0,
        slots: 0,
      };
    }

    const appointments =
      await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.doctor', 'doctor')
        .where('doctor.id IN (:...doctorIds)', {
          doctorIds,
        })
        .getMany();

    const slots =
      await this.slotRepository
        .createQueryBuilder('slot')
        .leftJoinAndSelect('slot.doctor', 'doctor')
        .where('doctor.id IN (:...doctorIds)', {
          doctorIds,
        })
        .getCount();

    return {
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter((d) => d.isActive).length,
      appointments: appointments.length,
      completed: appointments.filter(
        (a) => a.status === 'COMPLETED',
      ).length,
      cancelled: appointments.filter(
        (a) => a.status === 'CANCELLED',
      ).length,
      pending: appointments.filter(
        (a) => a.status === 'BOOKED',
      ).length,
      slots,
    };
  }
async getHospitalProfile(hospitalId: string) {
  const hospital = await this.hospitalRepository.findOne({
    where: { id: hospitalId },
  });

  if (!hospital) {
    throw new NotFoundException('Hospital not found');
  }

  const { password, ...result } = hospital;

  return result;
}

async updateHospitalProfile(
  hospitalId: string,
  data: any,
) {
  const hospital = await this.hospitalRepository.findOne({
    where: { id: hospitalId },
  });

  if (!hospital) {
    throw new Error('Hospital not found');
  }

  hospital.hospitalName =
    data.hospitalName ?? hospital.hospitalName;

  hospital.mobile =
    data.mobile ?? hospital.mobile;

  hospital.city =
    data.city ?? hospital.city;

  hospital.state =
    data.state ?? hospital.state;

  hospital.address =
    data.address ?? hospital.address;

  hospital.licenseNumber =
    data.licenseNumber ?? hospital.licenseNumber;

  const updatedHospital =
    await this.hospitalRepository.save(hospital);

  const { password, ...result } = updatedHospital;

  return result;
}

async changePassword(
  hospitalId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (!currentPassword || !newPassword) {
    throw new BadRequestException(
      'Current password and new password are required',
    );
  }

  const hospital = await this.hospitalRepository.findOne({
    where: {
      id: hospitalId,
    },
  });

  if (!hospital) {
    throw new NotFoundException('Hospital not found');
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    hospital.password,
  );

  if (!isMatch) {
    throw new BadRequestException(
      'Current password is incorrect',
    );
  }

  hospital.password = await bcrypt.hash(newPassword, 10);

  await this.hospitalRepository.save(hospital);

  return {
    message: 'Password changed successfully',
  };
}
async uploadHospitalPhoto(
  hospitalId: string,
  file: Express.Multer.File,
) {
  const hospital = await this.hospitalRepository.findOne({
    where: { id: hospitalId },
  });

  if (!hospital) {
    throw new NotFoundException('Hospital not found');
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
            folder: 'hospitals',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result!.secure_url);
          },
        );

      Readable.from(file.buffer).pipe(uploadStream);
    },
  );

  hospital.profileImage = imageUrl;

  const updatedHospital =
    await this.hospitalRepository.save(hospital);

  const { password, ...result } = updatedHospital;

  return result;
}

async approveHospital(id: string) {
  const hospital = await this.hospitalRepository.findOne({
    where: { id },
  });

  if (!hospital) {
    throw new NotFoundException('Hospital not found');
  }

  hospital.isApproved = true;
  hospital.status = 'APPROVED';

  await this.hospitalRepository.save(hospital);

  try {
    await this.mailService.sendHospitalApproved({
      to: hospital.email,
      hospitalName: hospital.hospitalName,
    });
  } catch (error) {
    console.error(
      'Hospital approval email failed:',
      error,
    );
  }

  return {
    message: 'Hospital approved successfully',
  };
}

async rejectHospital(id: string) {
  const hospital = await this.hospitalRepository.findOne({
    where: { id },
  });

  if (!hospital) {
    throw new NotFoundException('Hospital not found');
  }

  hospital.isApproved = false;
  hospital.status = 'REJECTED';

  await this.hospitalRepository.save(hospital);

  try {
    await this.mailService.sendHospitalRejected({
      to: hospital.email,
      hospitalName: hospital.hospitalName,
    });
  } catch (error) {
    console.error(
      'Hospital rejection email failed:',
      error,
    );
  }

  return {
    message: 'Hospital rejected successfully',
  };
}
}
