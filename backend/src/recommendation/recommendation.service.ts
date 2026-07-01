import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Recommendation } from './recommendation.entity';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepo: Repository<Recommendation>,
  ) {}

  create(dto: CreateRecommendationDto) {
    const recommendation = this.recommendationRepo.create({
      ...dto,
      items: dto.items,
    });

    return this.recommendationRepo.save(recommendation);
  }

  findByPatient(patientId: string) {
    return this.recommendationRepo.find({
      where: {
        patientId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findByDoctor(doctorId: string) {
    return this.recommendationRepo.find({
      where: {
        doctorId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: string) {
    return this.recommendationRepo.findOne({
      where: { id },
    });
  }
}