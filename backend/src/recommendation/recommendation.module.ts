import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Recommendation } from './recommendation.entity';
import { RecommendationItem } from './recommendation-item.entity';

import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recommendation,
      RecommendationItem,
    ]),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}