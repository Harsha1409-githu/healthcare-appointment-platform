import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';

import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from './appointment.entity';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Doctor } from '../doctor/doctor.entity';
import { Slot, SlotType } from '../slot/slot.entity';
import { Patient } from '../patient/patient.entity';
import { MailService } from '../mail/mail.service';
import { NotificationService } from '../notification/notification.service';
import { SymptomHistory } from '../symptom-history/symptom-history.entity';
import { MedicalRecord } from '../medical-record/medical-record.entity';
import { Prescription } from '../prescription/prescription.entity';
import { FollowUp } from '../follow-up/follow-up.entity';
import { FamilyMember } from '../family-member/family-member.entity';
import { Consultation } from '../consultation/consultation.entity';
import { formatTime } from '../utils/time';
import { DoctorLiveStatus } from '../doctor/doctor.entity';

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

   @InjectRepository(FamilyMember)
private familyMemberRepo: Repository<FamilyMember>,

    @InjectRepository(SymptomHistory)
    private symptomHistoryRepo: Repository<SymptomHistory>,

    @InjectRepository(MedicalRecord)
    private medicalRecordRepo: Repository<MedicalRecord>,

    @InjectRepository(Prescription)
    private prescriptionRepo: Repository<Prescription>,

    @InjectRepository(FollowUp)
    private followUpRepo: Repository<FollowUp>,

    @InjectRepository(Consultation)
private consultationRepo: Repository<Consultation>,

    private dataSource: DataSource,

    private readonly mailService: MailService,

    private readonly notificationService: NotificationService,
  ) {}

  async bookAppointment(dto: CreateAppointmentDto, patientId: string) {
    if (!dto?.doctorId) throw new BadRequestException('doctorId is required');
    if (!dto?.slotId) throw new BadRequestException('slotId is required');
    if (!dto?.patientName) throw new BadRequestException('patientName is required');
    if (!dto?.patientPhone) throw new BadRequestException('patientPhone is required');
    if (!patientId) throw new BadRequestException('patientId is required');

    return await this.dataSource.transaction(async (manager) => {
      const doctor = await manager.findOne(Doctor, {
        where: { id: dto.doctorId },
        relations: { hospital: true },
      });

      if (!doctor) throw new NotFoundException('Doctor not found');
      

     const patient = await manager.findOne(Patient, {
  where: { id: patientId },
});

if (!patient) {
  throw new NotFoundException('Patient not found');
}

let familyMember: FamilyMember | null = null;

if (dto.familyMemberId) {
  familyMember = await manager.findOne(FamilyMember, {
    where: {
      id: dto.familyMemberId,
      patient: { id: patient.id },
    },
    relations: {
      patient: true,
    },
  });

  if (!familyMember) {
    throw new NotFoundException('Family member not found');
  }
}

      const slot = await manager.findOne(Slot, {
        where: { id: dto.slotId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!slot) throw new NotFoundException('Slot not found');
      if (!slot.isAvailable) throw new BadRequestException('Slot already booked');

      const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
const now = new Date();

if (slotDateTime <= now) {
  throw new BadRequestException(
    'Past slots cannot be booked. Please choose another slot.',
  );
}

this.validateDoctorLiveStatus(doctor, slot);

  const appointmentType =
  dto.appointmentType || AppointmentType.IN_PERSON;

const slotAllowed =
  slot.slotType === SlotType.BOTH ||
  String(slot.slotType) === String(appointmentType);

if (!slotAllowed) {
  throw new BadRequestException(
    `${appointmentType} booking is not allowed for this slot`,
  );
}

      slot.isAvailable = false;
      await manager.save(Slot, slot);

      const videoRoomId = `TryDoc-${doctor.id}-${patient.id}-${Date.now()}`;



const meetingLink =
  appointmentType === AppointmentType.VIDEO
    ? `https://meet.jit.si/TryDoc-${Date.now()}`
    : null;

const appointment = manager.create(Appointment, {
  doctor,
  slot,
  patient,
  familyMember,

  patientName: familyMember?.fullName || dto.patientName,
  patientPhone: familyMember?.mobile || dto.patientPhone,

  status: AppointmentStatus.BOOKED,
  appointmentType,

  videoRoomId:
    appointmentType === AppointmentType.VIDEO ? videoRoomId : null,

  meetingLink,
} as Partial<Appointment>);

      const savedAppointment = await manager.save(Appointment, appointment);

      try {
        await this.mailService.sendAppointmentConfirmation({
          to: patient.email,
          patientName: patient.fullName,
          doctorName: doctor.doctorName,
          specialization: doctor.specialization,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          hospitalName: doctor.hospital?.hospitalName || 'TryDoc Hospital',
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
        appointmentId: String(savedAppointment.id),
      });

      await this.notificationService.create({
        userId: doctor.id,
        role: 'doctor',
        title: 'New Appointment',
        message: `${patient.fullName} booked an appointment on ${slot.date} at ${slot.startTime}.`,
        appointmentId: String(savedAppointment.id),
      });

      if (doctor.hospital?.id) {
        await this.notificationService.create({
          userId: doctor.hospital.id,
          role: 'hospital',
          title: 'New Appointment',
          message: `Appointment booked with Dr. ${doctor.doctorName}.`,
          appointmentId: String(savedAppointment.id),
        });
      }

      return savedAppointment;
    });
  }

  async getAllAppointments() {
    return this.appointmentRepo.find({
      relations: {
        doctor: { hospital: true },
        slot: true,
        patient: true,
        familyMember: true,
      },
      order: { id: 'DESC' },
    });
  }

 async markPatientNoShow(id: number) {
  const appointment = await this.appointmentRepo.findOne({
    where: { id },
    relations: {
      patient: true,
      doctor: true,
      slot: true,
      familyMember: true,
    },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new BadRequestException('Completed appointment cannot be marked no-show');
  }

  appointment.status = AppointmentStatus.NO_SHOW_PATIENT;

  if (appointment.slot) {
    appointment.slot.isAvailable = true;
    await this.slotRepo.save(appointment.slot);
  }

  const saved = await this.appointmentRepo.save(appointment);

  await this.notificationService.create({
    userId: appointment.patient.id,
    role: 'patient',
    title: 'Appointment Missed',
    message: `You missed your appointment with Dr. ${appointment.doctor.doctorName}.`,
    appointmentId: String(appointment.id),
  });

  await this.notificationService.create({
    userId: appointment.doctor.id,
    role: 'doctor',
    title: 'Patient No-Show',
    message: `${appointment.patientName} did not join the appointment.`,
    appointmentId: String(appointment.id),
  });

  return saved;
}


async markCheckedIn(id: number) {
  const appointment = await this.appointmentRepo.findOne({
    where: { id },
    relations: {
      patient: true,
      doctor: true,
      slot: true,
      familyMember: true,
    },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new BadRequestException('Completed appointment cannot be checked in');
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new BadRequestException('Cancelled appointment cannot be checked in');
  }

  appointment.status = AppointmentStatus.CHECKED_IN;

  const saved = await this.appointmentRepo.save(appointment);

  await this.notificationService.create({
    userId: appointment.doctor.id,
    role: 'doctor',
    title: 'Patient Checked In',
    message: `${appointment.patientName} is ready for consultation.`,
    appointmentId: String(appointment.id),
  });

  return saved;
}

async markConsultationActive(id: number) {
  const appointment = await this.appointmentRepo.findOne({
    where: { id },
    relations: {
      patient: true,
      doctor: true,
      slot: true,
      familyMember: true,
    },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new BadRequestException('Appointment already completed');
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new BadRequestException('Cancelled appointment cannot be started');
  }

  appointment.status = AppointmentStatus.CONSULTATION_ACTIVE;

  appointment.doctor.liveStatus =
    appointment.appointmentType === AppointmentType.VIDEO
      ? DoctorLiveStatus.VIDEO_CONSULTATION
      : DoctorLiveStatus.IN_CONSULTATION;

  appointment.doctor.blockedUntil = null;

  await this.doctorRepo.save(appointment.doctor);

  const saved = await this.appointmentRepo.save(appointment);

  await this.notificationService.create({
    userId: appointment.patient.id,
    role: 'patient',
    title: 'Doctor Joined',
    message: `Dr. ${appointment.doctor.doctorName} has started your consultation.`,
    appointmentId: String(appointment.id),
  });

  return saved;
}

async markDoctorNoShow(id: number) {
  const appointment = await this.appointmentRepo.findOne({
    where: { id },
    relations: {
      patient: true,
      doctor: true,
      slot: true,
      familyMember: true,
    },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new BadRequestException('Completed appointment cannot be marked no-show');
  }

  appointment.status = AppointmentStatus.NO_SHOW_DOCTOR;

  if (appointment.slot) {
    appointment.slot.isAvailable = true;
    await this.slotRepo.save(appointment.slot);
  }

  const saved = await this.appointmentRepo.save(appointment);

  await this.notificationService.create({
    userId: appointment.patient.id,
    role: 'patient',
    title: 'Doctor Unavailable',
    message: `Dr. ${appointment.doctor.doctorName} could not join. Please reschedule or contact support.`,
    appointmentId: String(appointment.id),
  });

  await this.notificationService.create({
    userId: appointment.doctor.id,
    role: 'doctor',
    title: 'Doctor No-Show Marked',
    message: `Appointment with ${appointment.patientName} was marked as doctor no-show.`,
    appointmentId: String(appointment.id),
  });

  return saved;
}

async markDocumentationPending(id: number) {
  const appointment = await this.appointmentRepo.findOne({
    where: { id },
    relations: {
      patient: true,
      doctor: true,
      slot: true,
      familyMember: true,
    },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new BadRequestException('Completed appointment cannot be moved to documentation pending');
  }

  appointment.status = AppointmentStatus.DOCUMENTATION_PENDING;

  const saved = await this.appointmentRepo.save(appointment);

  await this.notificationService.create({
    userId: appointment.doctor.id,
    role: 'doctor',
    title: 'Documentation Pending',
    message: `Please complete notes and prescription for ${appointment.patientName}.`,
    appointmentId: String(appointment.id),
  });

  return saved;
}
  async getAnalytics() {
    const appointments = await this.appointmentRepo.find({
      relations: {
        doctor: { hospital: true },
        slot: true,
        patient: true,
        familyMember: true,
      },
    });

    const total = appointments.length;
    const booked = appointments.filter((a) => a.status === AppointmentStatus.BOOKED).length;
    const completed = appointments.filter((a) => a.status === AppointmentStatus.COMPLETED).length;
    const cancelled = appointments.filter((a) => a.status === AppointmentStatus.CANCELLED).length;

    const revenue = appointments
      .filter((a) => a.status === AppointmentStatus.COMPLETED)
      .reduce((sum, a) => sum + Number(a.doctor?.consultationFee || 0), 0);

    const hospitalRevenueMap = new Map<string, number>();
    const specializationMap = new Map<string, number>();

    appointments.forEach((appointment) => {
      if (appointment.status === AppointmentStatus.COMPLETED) {
        const hospitalName =
          appointment.doctor?.hospital?.hospitalName || 'Unknown Hospital';

        hospitalRevenueMap.set(
          hospitalName,
          (hospitalRevenueMap.get(hospitalName) || 0) +
            Number(appointment.doctor?.consultationFee || 0),
        );
      }

      const specialization = appointment.doctor?.specialization || 'Unknown';

      specializationMap.set(
        specialization,
        (specializationMap.get(specialization) || 0) + 1,
      );
    });

    return {
      total,
      booked,
      completed,
      cancelled,
      revenue,
      hospitalRevenue: Array.from(hospitalRevenueMap.entries()).map(
        ([name, value]) => ({ name, value }),
      ),
      specializationStats: Array.from(specializationMap.entries()).map(
        ([name, value]) => ({ name, value }),
      ),
    };
  }

  async getPatientProfile(appointmentId: number) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
      relations: {
        patient: true,
        doctor: true,
        slot: true,
        familyMember: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const patient = appointment.patient;

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const symptomHistory = await this.symptomHistoryRepo.find({
      where: {
        patient: { id: patient.id },
      },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const medicalRecords = await this.medicalRecordRepo.find({
      where: {
        patient: { id: patient.id },
      },
      order: { uploadedAt: 'DESC' },
      take: 10,
    });

    const prescriptions = await this.prescriptionRepo.find({
      where: {
        patient: { id: patient.id },
      },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const consultations = await this.consultationRepo.find({
  where: {
    patient: { id: patient.id },
  },
  relations: {
    appointment: true,
    doctor: true,
    patient: true,
  },
  order: {
    createdAt: 'DESC',
  },
  take: 10,
});

    const appointments = await this.appointmentRepo.find({
      where: {
        patient: { id: patient.id },
      },
      relations: {
        doctor: true,
        slot: true,
        familyMember: true,
      },
      order: { id: 'DESC' },
      take: 10,
    });

    const followUps = await this.followUpRepo.find({
      where: {
        patient: { id: patient.id },
      },
      relations: {
        doctor: true,
        patient: true,
        
      },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
  patient,
  appointment,
  symptomHistory,
  medicalRecords,
  prescriptions,
  consultations,
  appointments,
  followUps,
};
  }

  async getMyAppointments(patientId: string) {
    if (!patientId) throw new BadRequestException('patientId is required');

    return this.appointmentRepo.find({
      where: {
        patient: { id: patientId },
      },
      relations: {
        doctor: { hospital: true },
        slot: true,
        patient: true,
        familyMember: true,
      },
      order: { id: 'DESC' },
    });
  }

  async rescheduleAppointment(
  appointmentId: number,
  newSlotId: string,
  patientId: string,
) {
  return await this.dataSource.transaction(async (manager) => {
    const appointment = await manager.findOne(Appointment, {
      where: {
        id: appointmentId,
      },
      relations: {
        slot: true,
        patient: true,
        doctor: true,
        familyMember: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.patient?.id !== patientId) {
      throw new ForbiddenException(
        'You can only reschedule your own appointment',
      );
    }

    if (appointment.status !== AppointmentStatus.BOOKED) {
      throw new BadRequestException(
        'Only booked appointments can be rescheduled',
      );
    }

    const appointmentDateTime = new Date(
  `${appointment.slot.date}T${appointment.slot.startTime}`,
);

const now = new Date();

const cutoffTime = new Date(
  appointmentDateTime.getTime() - 2 * 60 * 60 * 1000,
);

if (now > cutoffTime) {
  throw new BadRequestException(
    'Reschedule is allowed only up to 2 hours before appointment time',
  );
}

    const newSlot = await manager.findOne(Slot, {
      where: {
        id: newSlotId,
      },
    });

    if (!newSlot) {
      throw new NotFoundException('New slot not found');
    }

    if (!newSlot.isAvailable) {
      throw new BadRequestException(
        'Selected slot is already booked',
      );
    }

    const slotAllowed =
  newSlot.slotType === SlotType.BOTH ||
  String(newSlot.slotType) ===
    String(appointment.appointmentType);

    if (!slotAllowed) {
      throw new BadRequestException(
        `${appointment.appointmentType} is not allowed for this slot`,
      );
    }

    // Release old slot
    appointment.slot.isAvailable = true;
    await manager.save(Slot, appointment.slot);

    // Reserve new slot
    newSlot.isAvailable = false;
    await manager.save(Slot, newSlot);

    // Update appointment
    appointment.slot = newSlot;

    const updated = await manager.save(
      Appointment,
      appointment,
    );

    await this.notificationService.create({
      userId: appointment.patient.id,
      role: 'patient',
      title: 'Appointment Rescheduled',
      message: `Your appointment has been moved to ${newSlot.date} at ${newSlot.startTime}.`,
      appointmentId: String(updated.id),
    });

    return updated;
  });
}

  async getAppointmentsByHospital(hospitalId: string) {
    if (!hospitalId) throw new BadRequestException('hospitalId is required');

    return this.appointmentRepo.find({
      where: {
        doctor: {
          hospital: { id: hospitalId },
        },
      },
      relations: {
        doctor: { hospital: true },
        slot: true,
        patient: true,
        familyMember: true,
      },
      order: { id: 'DESC' },
    });
  }

  async getAppointmentsByDoctor(doctorId: string) {
    if (!doctorId) throw new BadRequestException('doctorId is required');

    return this.appointmentRepo.find({
      where: {
        doctor: { id: doctorId },
      },
      relations: {
        doctor: { hospital: true },
        slot: true,
        patient: true,
        familyMember: true,
      },
      order: { id: 'DESC' },
    });
  }

  async getHospitalAnalytics(hospitalId: string) {
    const appointments = await this.appointmentRepo.find({
      where: {
        doctor: {
          hospital: { id: hospitalId },
        },
      },
      relations: {
        doctor: { hospital: true },
        slot: true,
        patient: true,
        familyMember: true,
      },
    });

    const totalAppointments = appointments.length;
    const booked = appointments.filter((a) => a.status === AppointmentStatus.BOOKED).length;
    const completed = appointments.filter((a) => a.status === AppointmentStatus.COMPLETED).length;
    const cancelled = appointments.filter((a) => a.status === AppointmentStatus.CANCELLED).length;

    const revenue = appointments
      .filter((a) => a.status === AppointmentStatus.COMPLETED)
      .reduce((sum, a) => sum + Number(a.doctor?.consultationFee || 0), 0);

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
          doctorName: appointment.doctor?.doctorName || 'Unknown Doctor',
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

      const specialization = appointment.doctor?.specialization || 'Unknown';

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

    const doctorPerformance = Array.from(doctorMap.values()).sort(
      (a, b) => b.revenue - a.revenue,
    );

    const specializationStats = Array.from(specializationMap.entries()).map(
      ([name, value]) => ({ name, value }),
    );

    const monthlyStats = monthOrder
      .filter((month) => monthlyMap.has(month))
      .map((month) => ({
        month,
        appointments: monthlyMap.get(month)!.appointments,
        revenue: monthlyMap.get(month)!.revenue,
      }));

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
      topDoctor: doctorPerformance[0] || null,
    };
  }

  async getAppointmentById(id: number) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: {
        doctor: { hospital: true },
        slot: true,
        patient: true,
        familyMember: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async cancelAppointment(id: number, userId: string, role?: string) {
    return await this.dataSource.transaction(async (manager) => {
      const appointment = await manager.findOne(Appointment, {
        where: { id },
        relations: {
          slot: true,
          patient: true,
          familyMember: true,
          doctor: { hospital: true },
        },
      });

      if (!appointment) throw new NotFoundException('Appointment not found');

      const isPatient =
        role === 'patient' && appointment.patient?.id === userId;

      const isHospital =
        role === 'hospital' && appointment.doctor?.hospital?.id === userId;

      const isAdmin = role === 'admin';

      if (!isPatient && !isHospital && !isAdmin) {
        throw new ForbiddenException(
          'You are not allowed to cancel this appointment',
        );
      }

      if (appointment.status === AppointmentStatus.CANCELLED) {
        throw new BadRequestException('Appointment already cancelled');
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

      const updatedAppointment = await manager.save(Appointment, appointment);

      try {
        await this.mailService.sendAppointmentCancelled({
          to: appointment.patient.email,
          patientName: appointment.patient.fullName,
          doctorName: appointment.doctor.doctorName,
          date: appointment.slot?.date,
          startTime: formatTime(appointment.slot?.startTime),
        });
      } catch (error) {
        console.error('Appointment cancel email failed', error);
      }

      await this.notificationService.create({
        userId: appointment.patient.id,
        role: 'patient',
        title: 'Appointment Cancelled',
        message: `Appointment with Dr. ${appointment.doctor.doctorName} has been cancelled.`,
        appointmentId: String(appointment.id),
      });

      await this.notificationService.create({
        userId: appointment.doctor.id,
        role: 'doctor',
        title: 'Appointment Cancelled',
        message: `${appointment.patientName} cancelled the appointment.`,
        appointmentId: String(appointment.id),
      });

      if (appointment.doctor?.hospital?.id) {
        await this.notificationService.create({
          userId: appointment.doctor.hospital.id,
          role: 'hospital',
          title: 'Appointment Cancelled',
          message: `Appointment with Dr. ${appointment.doctor.doctorName} has been cancelled.`,
          appointmentId: String(appointment.id),
        });
      }

      return updatedAppointment;
    });
  }

  async findUpcomingAppointments() {
    const now = new Date();

    const next24Hours = new Date();
    next24Hours.setHours(next24Hours.getHours() + 24);

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
        familyMember: true,
      },
    });
  }

  async completeAppointment(id: number) {
  const appointment = await this.appointmentRepo.findOne({
    where: { id },
    relations: {
      doctor: { hospital: true },
      slot: true,
      patient: true,
      familyMember: true,
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

  if (
    appointment.status === AppointmentStatus.NO_SHOW_PATIENT ||
    appointment.status === AppointmentStatus.NO_SHOW_DOCTOR ||
    appointment.status === AppointmentStatus.EXPIRED
  ) {
    throw new BadRequestException(
      'Missed appointment cannot be completed',
    );
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new BadRequestException('Appointment already completed');
  }

  if (!appointment.consultationCompleted) {
    appointment.status = AppointmentStatus.DOCUMENTATION_PENDING;
    await this.appointmentRepo.save(appointment);

    await this.notificationService.create({
      userId: appointment.doctor.id,
      role: 'doctor',
      title: 'Documentation Pending',
      message: `Please complete notes and prescription for ${appointment.patientName}.`,
      appointmentId: String(appointment.id),
    });

    throw new BadRequestException(
      'Please save consultation notes before completing appointment',
    );
  }

  appointment.status = AppointmentStatus.COMPLETED;
appointment.consultationCompleted = true;

appointment.doctor.liveStatus = DoctorLiveStatus.AVAILABLE;
appointment.doctor.blockedUntil = null;

await this.doctorRepo.save(appointment.doctor);

const completedAppointment =
  await this.appointmentRepo.save(appointment);

  try {
    await this.mailService.sendAppointmentCompleted({
      to: appointment.patient.email,
      patientName: appointment.patient.fullName,
      doctorName: appointment.doctor.doctorName,
    });
  } catch (error) {
    console.error('Appointment completed email failed', error);
  }

  await this.notificationService.create({
    userId: appointment.patient.id,
    role: 'patient',
    title: 'Consultation Completed',
    message: `Your consultation with Dr. ${appointment.doctor.doctorName} has been completed.`,
    appointmentId: String(appointment.id),
  });

  await this.notificationService.create({
    userId: appointment.doctor.id,
    role: 'doctor',
    title: 'Consultation Completed',
    message: `Consultation with ${appointment.patientName} has been completed.`,
    appointmentId: String(appointment.id),
  });

  if (appointment.doctor?.hospital?.id) {
    await this.notificationService.create({
      userId: appointment.doctor.hospital.id,
      role: 'hospital',
      title: 'Consultation Completed',
      message: `Dr. ${appointment.doctor.doctorName} completed a consultation.`,
      appointmentId: String(appointment.id),
    });
  }

  return completedAppointment;
}
  async getDoctorEarnings(doctorId: string) {
  const appointments = await this.appointmentRepo.find({
    where: {
      doctor: {
        id: doctorId,
      },
    },
    relations: {
      doctor: true,
      slot: true,
      patient: true,
      familyMember: true,
    },
  });

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.slice(0, 7);

  const completed = appointments.filter(
    (a) => a.status === AppointmentStatus.COMPLETED,
  );

  const todayCompleted = completed.filter(
    (a) => a.slot?.date === today,
  );

  const monthCompleted = completed.filter(
    (a) => a.slot?.date?.startsWith(currentMonth),
  );

  const fee = Number(appointments[0]?.doctor?.consultationFee || 0);

  const todayRevenue = todayCompleted.length * fee;
  const monthRevenue = monthCompleted.length * fee;
  const totalRevenue = completed.length * fee;

  const booked = appointments.filter(
    (a) => a.status === AppointmentStatus.BOOKED,
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status === AppointmentStatus.CANCELLED,
  ).length;

  const dailyMap = new Map<string, number>();

  monthCompleted.forEach((appointment) => {
    const date = appointment.slot?.date || 'Unknown';
    dailyMap.set(date, (dailyMap.get(date) || 0) + fee);
  });

  const dailyRevenue = Array.from(dailyMap.entries())
    .map(([date, revenue]) => ({
      date,
      revenue,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    todayRevenue,
    monthRevenue,
    totalRevenue,
    completedConsultations: completed.length,
    booked,
    cancelled,
    consultationFee: fee,
    dailyRevenue,
  };
}

private validateDoctorLiveStatus(doctor: any, slot?: Slot) {
  const now = new Date();

  if (!doctor) {
    throw new BadRequestException('Doctor not found');
  }

  // If old break time already passed, allow booking
  const blockedUntil = doctor.blockedUntil
    ? new Date(doctor.blockedUntil)
    : null;

  if (
    doctor.liveStatus === DoctorLiveStatus.BREAK &&
    blockedUntil &&
    blockedUntil <= now
  ) {
    return;
  }

  // Break should block only slots before blockedUntil
  if (
    doctor.liveStatus === DoctorLiveStatus.BREAK &&
    blockedUntil &&
    slot?.date &&
    slot?.startTime
  ) {
    const slotDateTime = new Date(
      `${slot.date}T${slot.startTime}`,
    );

    if (slotDateTime < blockedUntil) {
      const time = blockedUntil.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      throw new BadRequestException(
        `Doctor is on break until ${time}. Please choose a later slot.`,
      );
    }

    return;
  }

  if (doctor.liveStatus === DoctorLiveStatus.AVAILABLE) {
    return;
  }

  if (doctor.liveStatus === DoctorLiveStatus.OFFLINE) {
    throw new BadRequestException(
      'Doctor is currently offline. Please choose another doctor or slot.',
    );
  }

  if (doctor.liveStatus === DoctorLiveStatus.VACATION) {
    throw new BadRequestException(
      'Doctor is on vacation. Please choose another slot.',
    );
  }

  if (doctor.liveStatus === DoctorLiveStatus.IN_CONSULTATION) {
    return;
  }

  if (doctor.liveStatus === DoctorLiveStatus.VIDEO_CONSULTATION) {
    return;
  }
}
}