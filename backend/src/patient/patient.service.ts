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
import { Appointment } from '../appointment/appointment.entity';
import { Prescription } from '../prescription/prescription.entity';
import { MedicineReminder } from '../medicine-reminder/medicine-reminder.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    @InjectRepository(Appointment)
private appointmentRepo: Repository<Appointment>,

@InjectRepository(Prescription)
private prescriptionRepo: Repository<Prescription>,

@InjectRepository(MedicineReminder)
private reminderRepo: Repository<MedicineReminder>,

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
async getTimeline(patientId: string) {
  const timeline: {
    type: string;
    title: string;
    description: string;
    date: Date;
  }[] = [];

  const reminders = await this.reminderRepo.find({
    where: { patientId },
  });

  reminders.forEach((item) => {
    timeline.push({
      type: 'REMINDER',
      title: 'Medicine Reminder Created',
      description: item.medicineName,
      date: item.createdAt,
    });
  });

  return timeline.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  );
}
async getHealthInsights(patientId: string) {
 const appointments = await this.appointmentRepo.find({
  where: {
    patient: {
      id: patientId,
    },
  },
});

  const prescriptions = await this.prescriptionRepo.find({
  where: {
    patient: {
      id: patientId,
    },
  },
});

  const reminders = await this.reminderRepo.find({
    where: {
      patientId,
      isActive: true,
    },
  });

  const completedAppointments = appointments.filter(
    (a) => a.status === 'COMPLETED',
  ).length;

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'BOOKED',
  ).length;

  let healthScore = 60;

  healthScore += completedAppointments * 3;
  healthScore += reminders.length * 2;
  healthScore += prescriptions.length * 2;

  if (healthScore > 100) {
    healthScore = 100;
  }

  let suggestion =
    'Maintain regular consultations and follow medicine schedules.';

  if (reminders.length > 0) {
    suggestion =
      'You have active medicine reminders. Continue medication as prescribed.';
  }

  if (upcomingAppointments > 0) {
    suggestion =
      'You have upcoming appointments. Attend consultations on time.';
  }

  return {
    healthScore,
    completedAppointments,
    upcomingAppointments,
    prescriptions: prescriptions.length,
    activeReminders: reminders.length,
    suggestion,
  };
}
}

