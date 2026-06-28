import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { LabOrder } from './lab-order.entity';

@Entity('lab_order_item')
export class LabOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testName: string;

  @Column()
  category: string;

  @Column()
  price: number;

  @ManyToOne(
    () => LabOrder,
    (order) => order.items,
    {
      onDelete: 'CASCADE',
    },
  )
  order: LabOrder;
}