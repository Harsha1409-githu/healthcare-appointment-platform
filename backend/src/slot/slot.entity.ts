import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';

export enum SlotType {
  IN_PERSON = 'IN_PERSON',
  VIDEO = 'VIDEO',
  BOTH = 'BOTH',
}

@Entity()
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({
    type: 'enum',
    enum: SlotType,
    default: SlotType.BOTH,
  })
  slotType: SlotType;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Doctor, (doctor) => doctor.slots, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;
}