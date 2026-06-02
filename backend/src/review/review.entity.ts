import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => Doctor, { eager: true })
  doctor: Doctor;

  @ManyToOne(() => Patient, { eager: true })
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;
}