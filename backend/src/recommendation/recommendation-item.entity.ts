import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Recommendation } from './recommendation.entity';

@Entity('recommendation_item')
export class RecommendationItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedPrice: number;

  @ManyToOne(() => Recommendation, (recommendation) => recommendation.items, {
    onDelete: 'CASCADE',
  })
  recommendation: Recommendation;
}