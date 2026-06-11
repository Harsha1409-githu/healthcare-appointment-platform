import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Patient } from '../patient/patient.entity';

@Entity('symptom_history')
export class SymptomHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  symptoms: string;

  @Column()
  condition: string;

  @Column()
  specialization: string;

  @Column({
    type: 'text',
  })
  advice: string;

  @Column({
    default: false,
  })
  urgent: boolean;

  @ManyToOne(() => Patient, {
    eager: true,
    nullable: true,
  })
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;
}