import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('medicine_reminder')
export class MedicineReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column()
  medicineName: string;

  @Column()
  dosage: string;

  @Column()
  reminderTime: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}