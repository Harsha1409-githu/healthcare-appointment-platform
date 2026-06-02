import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';

@Entity()
export class DoctorAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Doctor)
  doctor: Doctor;

  @Column()
  dayOfWeek: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  // ✅ ADD THIS (IMPORTANT)
  @Column({ default: 15 })
  slotDuration: number;
}