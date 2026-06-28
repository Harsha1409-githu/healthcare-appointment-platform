import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Patient } from '../patient/patient.entity';
import { FamilyMember } from '../family-member/family-member.entity';

@Entity('emergency_profile')
export class EmergencyProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  allergies: string;

  @Column({ nullable: true })
  chronicDiseases: string;

  @Column({ nullable: true })
  currentMedications: string;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ nullable: true })
  insuranceNumber: string;

  @Column({ default: false })
  organDonor: boolean;

  @ManyToOne(() => Patient, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  patient: Patient;

  @ManyToOne(() => FamilyMember, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  familyMember: FamilyMember;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}