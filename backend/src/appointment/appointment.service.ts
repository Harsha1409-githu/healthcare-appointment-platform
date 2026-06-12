import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import {
  Appointment,
  AppointmentStatus,
} from './appointment.entity';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Doctor } from '../doctor/doctor.entity';
import { Slot } from '../slot/slot.entity';
import { Patient } from '../patient/patient.entity';
import { MailService } from '../mail/mail.service';
import { NotificationService } from '../notification/notification.service';
import { SymptomHistory } from '../symptom-history/symptom-history.entity';
import { MedicalRecord } from '../medical-record/medical-record.entity';
import { Prescription } from '../prescription/prescription.entity';
import { Between } from 'typeorm';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    @InjectRepository(SymptomHistory)
private symptomHistoryRepo: Repository<SymptomHistory>,

@InjectRepository(MedicalRecord)
private medicalRecordRepo: Repository<MedicalRecord>,

@InjectRepository(Prescription)
private prescriptionRepo: Repository<Prescription>,

    private dataSource: DataSource,

    private readonly mailService: MailService,

    private readonly notificationService: NotificationService,
  ) {}

  async bookAppointment(
    dto: CreateAppointmentDto,
    patientId: string,
  ) {
    if (!dto?.doctorId) {
      throw new BadRequestException('doctorId is required');
    }

    if (!dto?.slotId) {
      throw new BadRequestException('slotId is required');
    }

    if (!dto?.patientName) {
      throw new BadRequestException('patientName is required');
    }

    if (!dto?.patientPhone) {
      throw new BadRequestException('patientPhone is required');
    }

    if (!patientId) {
      throw new BadRequestException('patientId is required');
    }

    return await this.dataSource.transaction(async (manager) => {
      const doctor = await manager.findOne(Doctor, {
        where: { id: dto.doctorId },
        relations: {
          hospital: true,
        },
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      const patient = await manager.findOne(Patient, {
        where: { id: patientId },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const slot = await manager.findOne(Slot, {
        where: { id: dto.slotId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!slot) {
        throw new NotFoundException('Slot not found');
      }

      if (!slot.isAvailable) {
        throw new BadRequestException('Slot already booked');
      }

      slot.isAvailable = false;
      await manager.save(Slot, slot);

      const videoRoomId = `medicare-${doctor.id}-${patient.id}-${Date.now()}`;

const appointment = manager.create(Appointment, {
  doctor,
  slot,
  patient,
  patientName: dto.patientName,
  patientPhone: dto.patientPhone,
  status: AppointmentStatus.BOOKED,
  videoRoomId,
});

      const savedAppointment = await manager.save(
        Appointment,
        appointment,
      );

      try {
        await this.mailService.sendAppointmentConfirmation({
          to: patient.email,
          patientName: patient.fullName,
          doctorName: doctor.doctorName,
          specialization: doctor.specialization,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          hospitalName:
            doctor.hospital?.hospitalName ||
            'MediCare Hospital',
          fee: doctor.consultationFee,
        });
      } catch (mailError) {
        console.error('Email sending failed:', mailError);
      }

      await this.notificationService.create({
        userId: patient.id,
        role: 'patient',
        title: 'Appointment Booked',
        message: `Your appointment with Dr. ${doctor.doctorName} is booked for ${slot.date} at ${slot.startTime}.`,
      });

      await this.notificationService.create({
        userId: doctor.id,
        role: 'doctor',
        title: 'New Appointment',
        message: `${patient.fullName} booked an appointment on ${slot.date} at ${slot.startTime}.`,
      });

      if (doctor.hospital?.id) {
        await this.notificationService.create({
          userId: doctor.hospital.id,
          role: 'hospital',
          title: 'New Appointment',
          message: `Appointment booked with Dr. ${doctor.doctorName}.`,
        });
      }

      return savedAppointment;
    });
  }

  async getAllAppointments() {
    return this.appointmentRepo.find({
      relations: {
        doctor: {
          hospital: true,
        },
        slot: true,
        patient: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getAnalytics() {
    const appointments = await this.appointmentRepo.find({
      relations: {
        doctor: {
          hospital: true,
        },
        slot: true,
        patient: true,
      },
    });

    const total = appointments.length;

    const booked = appointments.filter(
      (appointment) =>
        appointment.status === AppointmentStatus.BOOKED,
    ).length;

    const completed = appointments.filter(
      (appointment) =>
        appointment.status === AppointmentStatus.COMPLETED,
    ).length;

    const cancelled = appointments.filter(
      (appointment) =>
        appointment.status === AppointmentStatus.CANCELLED,
    ).length;

    const revenue = appointments
      .filter(
        (appointment) =>
          appointment.status === AppointmentStatus.COMPLETED,
      )
      .reduce(
        (sum, appointment) =>
          sum +
          Number(
            appointment.doctor?.consultationFee || 0,
          ),
        0,
      );

    const hospitalRevenueMap = new Map<string, number>();
    const specializationMap = new Map<string, number>();

    appointments.forEach((appointment) => {
      if (appointment.status === AppointmentStatus.COMPLETED) {
        const hospitalName =
          appointment.doctor?.hospital?.hospitalName ||
          'Unknown Hospital';

        hospitalRevenueMap.set(
          hospitalName,
          (hospitalRevenueMap.get(hospitalName) || 0) +
            Number(appointment.doctor?.consultationFee || 0),
        );
      }

      const specialization =
        appointment.doctor?.specialization || 'Unknown';

      specializationMap.set(
        specialization,
        (specializationMap.get(specialization) || 0) + 1,
      );
    });

    const hospitalRevenue = Array.from(
      hospitalRevenueMap.entries(),
    ).map(([name, value]) => ({
      name,
      value,
    }));

    const specializationStats = Array.from(
      specializationMap.entries(),
    ).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      total,
      booked,
      completed,
      cancelled,
      revenue,
      hospitalRevenue,
      specializationStats,
    };
  }

  async getPatientProfile(
  appointmentId: number,
) {
  const appointment =
  await this.appointmentRepo.findOne({
      where: {
        id: appointmentId,
      },
      relations: {
        patient: true,
      },
    });

  if (!appointment) {
    throw new NotFoundException(
      'Appointment not found',
    );
  }

  const patient = appointment.patient;

  const symptomHistory =
    await this.symptomHistoryRepo.find({
      where: {
        patient: {
          id: patient.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });

  const medicalRecords =
    await this.medicalRecordRepo.find({
      where: {
        patient: {
          id: patient.id,
        },
      },
      order: {
        uploadedAt: 'DESC',
      },
      take: 10,
    });

  const prescriptions =
    await this.prescriptionRepo.find({
      where: {
        patient: {
          id: patient.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });

  return {
    patient,
    symptomHistory,
    medicalRecords,
    prescriptions,
  };
}

  async getMyAppointments(patientId: string) {
    if (!patientId) {
      throw new BadRequestException('patientId is required');
    }

    return this.appointmentRepo.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      relations: {
        doctor: {
          hospital: true,
        },
        slot: true,
        patient: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getAppointmentsByHospital(hospitalId: string) {
    if (!hospitalId) {
      throw new BadRequestException('hospitalId is required');
    }

    return this.appointmentRepo.find({
      where: {
        doctor: {
          hospital: {
            id: hospitalId,
          },
        },
      },
      relations: {
        doctor: {
          hospital: true,
        },
        slot: true,
        patient: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getAppointmentsByDoctor(doctorId: string) {
    
    if (!doctorId) {
      throw new BadRequestException('doctorId is required');
    }

    return this.appointmentRepo.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      relations: {
        doctor: {
          hospital: true,
        },
        slot: true,
        patient: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }


  async getHospitalAnalytics(hospitalId: string) {
  const appointments = await this.appointmentRepo.find({
    where: {
      doctor: {
        hospital: {
          id: hospitalId,
        },
      },
    },
    relations: {
      doctor: {
        hospital: true,
      },
      slot: true,
      patient: true,
    },
  });

  const totalAppointments = appointments.length;

  const booked = appointments.filter(
    (a) => a.status === AppointmentStatus.BOOKED,
  ).length;

  const completed = appointments.filter(
    (a) => a.status === AppointmentStatus.COMPLETED,
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status === AppointmentStatus.CANCELLED,
  ).length;

  const revenue = appointments
    .filter((a) => a.status === AppointmentStatus.COMPLETED)
    .reduce(
      (sum, a) =>
        sum + Number(a.doctor?.consultationFee || 0),
      0,
    );

  const today = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter(
    (a) => a.slot?.date === today,
  ).length;

  const doctorMap = new Map<
    string,
    {
      doctorName: string;
      appointments: number;
      completed: number;
      revenue: number;
    }
  >();

  const specializationMap = new Map<string, number>();
  const monthlyMap = new Map<
    string,
    {
      appointments: number;
      revenue: number;
    }
  >();

  appointments.forEach((appointment) => {
    const doctorId = appointment.doctor?.id || 'unknown';

    if (!doctorMap.has(doctorId)) {
      doctorMap.set(doctorId, {
        doctorName:
          appointment.doctor?.doctorName || 'Unknown Doctor',
        appointments: 0,
        completed: 0,
        revenue: 0,
      });
    }

    const doctorStats = doctorMap.get(doctorId)!;
    doctorStats.appointments += 1;

    if (appointment.status === AppointmentStatus.COMPLETED) {
      doctorStats.completed += 1;
      doctorStats.revenue += Number(
        appointment.doctor?.consultationFee || 0,
      );
    }

    const specialization =
      appointment.doctor?.specialization || 'Unknown';

    specializationMap.set(
      specialization,
      (specializationMap.get(specialization) || 0) + 1,
    );

    const rawDate = appointment.slot?.date;

    if (rawDate) {
      const month = new Date(rawDate).toLocaleString('default', {
        month: 'short',
      });

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          appointments: 0,
          revenue: 0,
        });
      }

      const monthStats = monthlyMap.get(month)!;
      monthStats.appointments += 1;

      if (appointment.status === AppointmentStatus.COMPLETED) {
        monthStats.revenue += Number(
          appointment.doctor?.consultationFee || 0,
        );
      }
    }
  });

  const doctorPerformance = Array.from(
    doctorMap.values(),
  ).sort((a, b) => b.revenue - a.revenue);

  const specializationStats = Array.from(
    specializationMap.entries(),
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const monthOrder = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const monthlyStats = monthOrder
    .filter((month) => monthlyMap.has(month))
    .map((month) => ({
      month,
      appointments: monthlyMap.get(month)!.appointments,
      revenue: monthlyMap.get(month)!.revenue,
    }));

  const topDoctor = doctorPerformance[0] || null;

  return {
    totalAppointments,
    booked,
    completed,
    cancelled,
    revenue,
    todayAppointments,
    doctorPerformance,
    specializationStats,
    monthlyStats,
    topDoctor,
  };
}
  async getAppointmentById(id: number) {
  const appointment = await this.appointmentRepo.findOne({
    where: { id },
    relations: {
      doctor: {
        hospital: true,
      },
      slot: true,
      patient: true,
    },
  });

  if (!appointment) {
    throw new NotFoundException(
      'Appointment not found',
    );
  }

  return appointment;
}
  async cancelAppointment(
    id: number,
    userId: string,
    role?: string,
  ) {
    return await this.dataSource.transaction(async (manager) => {
      const appointment = await manager.findOne(Appointment, {
        where: { id },
        relations: {
          slot: true,
          patient: true,
          doctor: {
            hospital: true,
          },
        },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      const isPatient =
        role === 'patient' &&
        appointment.patient?.id === userId;

      const isHospital =
        role === 'hospital' &&
        appointment.doctor?.hospital?.id === userId;

      const isAdmin = role === 'admin';

      if (!isPatient && !isHospital && !isAdmin) {
        throw new ForbiddenException(
          'You are not allowed to cancel this appointment',
        );
      }

      if (appointment.status === AppointmentStatus.CANCELLED) {
        throw new BadRequestException(
          'Appointment already cancelled',
        );
      }

      if (appointment.status === AppointmentStatus.COMPLETED) {
        throw new BadRequestException(
          'Completed appointment cannot be cancelled',
        );
      }

      appointment.status = AppointmentStatus.CANCELLED;

      if (appointment.slot) {
        appointment.slot.isAvailable = true;
        await manager.save(Slot, appointment.slot);
      }

      const updatedAppointment = await manager.save(
        Appointment,
        appointment,
      );

      try {
        await this.mailService.sendAppointmentCancelled({
          to: appointment.patient.email,
          patientName: appointment.patient.fullName,
          doctorName: appointment.doctor.doctorName,
          date: appointment.slot?.date,
          startTime: appointment.slot?.startTime,
        });
      } catch (error) {
        console.error(
          'Appointment cancel email failed',
          error,
        );
      }

      await this.notificationService.create({
        userId: appointment.patient.id,
        role: 'patient',
        title: 'Appointment Cancelled',
        message: `Appointment with Dr. ${appointment.doctor.doctorName} has been cancelled.`,
      });

      await this.notificationService.create({
        userId: appointment.doctor.id,
        role: 'doctor',
        title: 'Appointment Cancelled',
        message: `${appointment.patientName} cancelled the appointment.`,
      });

      if (appointment.doctor?.hospital?.id) {
        await this.notificationService.create({
          userId: appointment.doctor.hospital.id,
          role: 'hospital',
          title: 'Appointment Cancelled',
          message: `Appointment with Dr. ${appointment.doctor.doctorName} has been cancelled.`,
        });
      }

      return updatedAppointment;
    });
  }

  async findUpcomingAppointments() {
  const now = new Date();

  const next24Hours = new Date();
  next24Hours.setHours(
    next24Hours.getHours() + 24,
  );

  return this.appointmentRepo.find({
    where: {
      status: AppointmentStatus.BOOKED,
      slot: {
        date: Between(
          now.toISOString().split('T')[0],
          next24Hours.toISOString().split('T')[0],
        ),
      },
    },
    relations: {
      patient: true,
      doctor: true,
      slot: true,
    },
  });
}

  async completeAppointment(id: number) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: {
        doctor: {
          hospital: true,
        },
        slot: true,
        patient: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException(
        'Cancelled appointment cannot be completed',
      );
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException(
        'Appointment already completed',
      );
    }

    appointment.status = AppointmentStatus.COMPLETED;

    const completedAppointment =
      await this.appointmentRepo.save(appointment);

    try {
      await this.mailService.sendAppointmentCompleted({
        to: appointment.patient.email,
        patientName: appointment.patient.fullName,
        doctorName: appointment.doctor.doctorName,
      });
    } catch (error) {
      console.error(
        'Appointment completed email failed',
        error,
      );
    }

    await this.notificationService.create({
      userId: appointment.patient.id,
      role: 'patient',
      title: 'Consultation Completed',
      message: `Your consultation with Dr. ${appointment.doctor.doctorName} has been completed.`,
    });

    await this.notificationService.create({
      userId: appointment.doctor.id,
      role: 'doctor',
      title: 'Consultation Completed',
      message: `Consultation with ${appointment.patientName} has been completed.`,
    });

    if (appointment.doctor?.hospital?.id) {
      await this.notificationService.create({
        userId: appointment.doctor.hospital.id,
        role: 'hospital',
        title: 'Consultation Completed',
        message: `Dr. ${appointment.doctor.doctorName} completed a consultation.`,
      });
    }

    return completedAppointment;
  }
}