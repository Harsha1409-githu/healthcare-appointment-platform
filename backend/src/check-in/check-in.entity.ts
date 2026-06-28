import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Appointment } from '../appointment/appointment.entity';

@Entity()
export class CheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Appointment, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  appointment: Appointment;

  @Column({ nullable: true })
  temperature: string;

  @Column({ nullable: true })
  bloodPressure: string;

  @Column({ nullable: true })
  weight: string;

  @Column('text', { nullable: true })
  symptoms: string;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}