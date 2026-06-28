import { Body, Controller, Post } from '@nestjs/common';
import { AiConsultationService } from './ai-consultation.service';
import { GenerateConsultationNotesDto } from './dto/generate-consultation-notes.dto';

@Controller('ai-consultation')
export class AiConsultationController {
  constructor(
    private readonly aiService: AiConsultationService,
  ) {}

  @Post('generate-notes')
  generateNotes(
    @Body()
    dto: GenerateConsultationNotesDto,
  ) {
    return this.aiService.generateNotes(dto);
  }
}