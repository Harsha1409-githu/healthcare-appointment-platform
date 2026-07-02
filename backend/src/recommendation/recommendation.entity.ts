import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RecommendationItem } from './recommendation-item.entity';
import { RecommendationCategory } from './enums/recommendation-category.enum';
import { RecommendationPriority } from './enums/recommendation-priority.enum';
import { RecommendationServiceType } from './enums/recommendation-service.enum';
import { RecommendationStatus } from './enums/recommendation-status.enum';

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
    enum: RecommendationCategory,
    default: RecommendationCategory.OTHER,
  })
  category: RecommendationCategory;

  @Column({
    type: 'enum',
    enum: RecommendationServiceType,
    default: RecommendationServiceType.CUSTOM,
  })
  service: RecommendationServiceType;

  @Column()
  title: string;

  @Column({ nullable: true })
  clinicalReason: string;

  @Column({
    type: 'enum',
    enum: RecommendationPriority,
    default: RecommendationPriority.ROUTINE,
  })
  priority: RecommendationPriority;

  @Column({
    type: 'enum',
    enum: RecommendationStatus,
    default: RecommendationStatus.RECOMMENDED,
  })
  status: RecommendationStatus;

  @Column({ nullable: true })
  notes: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  estimatedCost: number;

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