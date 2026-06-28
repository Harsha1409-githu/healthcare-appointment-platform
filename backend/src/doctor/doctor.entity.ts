import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { Hospital } from '../hospital/hospital.entity';
import { Slot } from '../slot/slot.entity';

export enum DoctorLiveStatus {
  AVAILABLE = 'AVAILABLE',
  IN_CONSULTATION = 'IN_CONSULTATION',
  VIDEO_CONSULTATION = 'VIDEO_CONSULTATION',
  BREAK = 'BREAK',
  OFFLINE = 'OFFLINE',
  VACATION = 'VACATION',
}

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  doctorName: string;

  @Column()
  specialization: string;

  @Column()
  experience: number;

  @Column()
  qualification: string;

  @Column()
  consultationFee: number;

  @Column()
  mobile: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Hospital)
  hospital: Hospital;

  @Column({ nullable: true })
profileImage: string;

  @OneToMany(() => Slot, (slot) => slot.doctor)
  slots: Slot[];

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({
  type: 'enum',
  enum: DoctorLiveStatus,
  default: DoctorLiveStatus.AVAILABLE,
})
liveStatus: DoctorLiveStatus;

@Column({
  type: 'timestamp',
  nullable: true,
})
blockedUntil: Date | null;
}