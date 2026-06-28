import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';

@Entity()
export class DoctorLeave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Doctor)
  doctor: Doctor;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  reason: string;

  @Column({
    default: 'APPROVED',
  })
  status: string;
}