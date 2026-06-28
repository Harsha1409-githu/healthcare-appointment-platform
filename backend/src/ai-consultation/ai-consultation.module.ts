import { Module } from '@nestjs/common';
import { AiConsultationController } from './ai-consultation.controller';
import { AiConsultationService } from './ai-consultation.service';

@Module({
  controllers: [AiConsultationController],
  providers: [AiConsultationService],
})
export class AiConsultationModule {}