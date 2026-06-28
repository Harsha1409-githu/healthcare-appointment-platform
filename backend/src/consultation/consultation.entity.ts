import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Appointment } from '../appointment/appointment.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';

@Entity()
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Appointment, { eager: true, onDelete: 'CASCADE' })
  appointment: Appointment;

  @ManyToOne(() => Doctor, { eager: true })
  doctor: Doctor;

  @ManyToOne(() => Patient, { eager: true })
  patient: Patient;

  @Column('text')
  diagnosis: string;

  @Column('text', { nullable: true })
  doctorNotes: string;

  @Column('text', { nullable: true })
  advice: string;

  @Column({ default: false })
  followUpRequired: boolean;

  @CreateDateColumn()
  createdAt: Date;
}