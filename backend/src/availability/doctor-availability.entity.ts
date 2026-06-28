import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';
import { SlotType } from '../slot/slot.entity';

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

  @Column({ default: 15 })
  slotDuration: number;

  @Column({
    type: 'enum',
    enum: SlotType,
    default: SlotType.BOTH,
  })
  slotType: SlotType;
}