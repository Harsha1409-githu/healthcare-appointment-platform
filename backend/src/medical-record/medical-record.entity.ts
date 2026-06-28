import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Patient } from '../patient/patient.entity';
import { FamilyMember } from '../family-member/family-member.entity';

export enum RecordType {
  LAB_REPORT = 'LAB_REPORT',
  PRESCRIPTION = 'PRESCRIPTION',
  XRAY = 'XRAY',
  MRI = 'MRI',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
}

@Entity('medical_record')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: RecordType,
  })
  recordType: RecordType;

  @Column()
  fileUrl: string;

  @Column({
    nullable: true,
  })
  fileName: string;

  @ManyToOne(() => Patient, {
    eager: true,
    nullable: false,
  })
  patient: Patient;

  @ManyToOne(() => FamilyMember, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  familyMember: FamilyMember;

  @CreateDateColumn()
  uploadedAt: Date;
}