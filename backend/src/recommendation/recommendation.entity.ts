import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RecommendationItem } from './recommendation-item.entity';
import { RecommendationStatus } from './enums/recommendation-status.enum';
import { RecommendationType } from './enums/recommendation-type.enum';

@Entity('recommendation')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appointmentId: number;

  @Column()
  doctorId: string;

  @Column()
  patientId: string;

  @Column({
    type: 'enum',
    enum: RecommendationType,
  })
  type: RecommendationType;

  @Column()
  title: string;

  @Column({ nullable: true })
  clinicalReason: string;

  @Column({ default: 'ROUTINE' })
  priority: string;

  @Column({
    type: 'enum',
    enum: RecommendationStatus,
    default: RecommendationStatus.RECOMMENDED,
  })
  status: RecommendationStatus;

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => RecommendationItem, (item) => item.recommendation, {
    cascade: true,
    eager: true,
  })
  items: RecommendationItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}