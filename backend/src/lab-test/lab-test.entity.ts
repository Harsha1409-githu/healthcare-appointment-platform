import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum LabTestStatus {
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('lab_test')
export class LabTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column()
  testName: string;

  @Column()
  category: string;

  @Column()
  preferredDate: string;

  @Column()
  preferredTime: string;

  @Column()
  address: string;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: LabTestStatus,
    default: LabTestStatus.BOOKED,
  })
  status: LabTestStatus;

  @CreateDateColumn()
  createdAt: Date;
}