import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string; // keep string for PostgreSQL stability

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Doctor, (doctor) => doctor.slots, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;
}