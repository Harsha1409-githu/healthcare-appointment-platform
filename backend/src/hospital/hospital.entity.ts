import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';
import { Exclude } from 'class-transformer';

@Entity('hospital')
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hospitalName: string;

  @Column({ unique: true })
  email: string;

  @Column()
@Exclude()
password: string;

  @Column()
  mobile: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  licenseNumber?: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: 'PENDING' })
  status: string;

  @OneToMany(
    () => Doctor,
    (doctor) => doctor.hospital,
  )
  doctors: Doctor[];
}