import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';
import { Slot } from '../slot/slot.entity';
import { Patient } from '../patient/patient.entity';

export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column()
  patientPhone: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;

  @ManyToOne(() => Doctor, { eager: true })
  doctor: Doctor;

  @ManyToOne(() => Slot, { eager: true })
  slot: Slot;

  @ManyToOne(() => Patient, { eager: true, nullable: true })
  patient: Patient;
}