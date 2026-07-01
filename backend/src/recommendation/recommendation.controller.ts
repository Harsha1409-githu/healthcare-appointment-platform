import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { RecommendationService } from './recommendation.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';

@Controller('recommendation')
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateRecommendationDto,
  ) {
    return this.recommendationService.create(dto);
  }

  @Get('patient/:patientId')
  patient(
    @Param('patientId')
    patientId: string,
  ) {
    return this.recommendationService.findByPatient(patientId);
  }

  @Get('doctor/:doctorId')
  doctor(
    @Param('doctorId')
    doctorId: string,
  ) {
    return this.recommendationService.findByDoctor(doctorId);
  }

  @Get(':id')
  getOne(
    @Param('id')
    id: string,
  ) {
    return this.recommendationService.findOne(id);
  }
}