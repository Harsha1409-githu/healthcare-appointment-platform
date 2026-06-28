import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { LabOrderItem } from './lab-order-item.entity';

export enum LabOrderStatus {
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('lab_order')
export class LabOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  patientId: string;

  @Column({ nullable: true })
  familyMemberId: string;

  @Column()
  totalAmount: number;

  @Column()
  preferredDate: string;

  @Column()
  preferredTime: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: LabOrderStatus,
    default: LabOrderStatus.BOOKED,
  })
  status: LabOrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => LabOrderItem,
    (item) => item.order,
    {
      cascade: true,
      eager: true,
    },
  )
  items: LabOrderItem[];
}