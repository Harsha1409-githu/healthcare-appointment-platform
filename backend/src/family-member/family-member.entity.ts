import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Patient } from '../patient/patient.entity';

@Entity('family_member')
export class FamilyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ default: 'SELF' })
  relation: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  profileImage: string;

  @ManyToOne(() => Patient, (patient) => patient.familyMembers, {
    onDelete: 'CASCADE',
  })
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;
}