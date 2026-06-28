import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';
import { Appointment } from '../appointment/appointment.entity';

@Entity()
export class FollowUp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Doctor)
  doctor: Doctor;

  @ManyToOne(() => Patient)
  patient: Patient;

 @ManyToOne(() => Appointment, { eager: true, nullable: true })
appointment: Appointment;

  @Column()
  followUpDate: string;

  @Column({ nullable: true })
  notes: string;

  @Column({
    default: 'PENDING',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}