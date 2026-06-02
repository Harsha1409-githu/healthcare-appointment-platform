import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Appointment } from '../appointment/appointment.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  diagnosis: string;

  @Column('text')
  medicines: string;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => Appointment, { eager: true })
  appointment: Appointment;

  @ManyToOne(() => Doctor, { eager: true })
  doctor: Doctor;

  @ManyToOne(() => Patient, { eager: true })
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;
}