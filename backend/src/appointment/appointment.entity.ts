import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';
import { Slot } from '../slot/slot.entity';
import { Patient } from '../patient/patient.entity';
import { FamilyMember } from '../family-member/family-member.entity';

export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  CHECKED_IN = 'CHECKED_IN',
  CONSULTATION_ACTIVE = 'CONSULTATION_ACTIVE',
  DOCUMENTATION_PENDING = 'DOCUMENTATION_PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW_PATIENT = 'NO_SHOW_PATIENT',
  NO_SHOW_DOCTOR = 'NO_SHOW_DOCTOR',
  EXPIRED = 'EXPIRED',
}

export enum AppointmentType {
  IN_PERSON = 'IN_PERSON',
  VIDEO = 'VIDEO',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column()
  patientPhone: string;

  @Column({ nullable: true })
  videoRoomId: string;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.IN_PERSON,
  })
  appointmentType: AppointmentType;

  @Column({ nullable: true })
  meetingLink: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;

  @Column({ default: false })
  consultationCompleted: boolean;

  @Column({ default: false })
  prescriptionCompleted: boolean;

  @Column({ default: false })
  followUpScheduled: boolean;

  @ManyToOne(() => Doctor, { eager: true })
  doctor: Doctor;

  @ManyToOne(() => Slot, { eager: true })
  slot: Slot;

  @ManyToOne(() => Patient, { eager: true, nullable: true })
  patient: Patient;

  @ManyToOne(() => FamilyMember, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  familyMember: FamilyMember;
}