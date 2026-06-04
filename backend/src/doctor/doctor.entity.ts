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

  @OneToMany(() => Slot, (slot) => slot.doctor)
  slots: Slot[];

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;
}