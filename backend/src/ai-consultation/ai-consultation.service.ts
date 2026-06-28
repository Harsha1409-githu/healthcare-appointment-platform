import { Injectable } from '@nestjs/common';
import { GenerateConsultationNotesDto } from './dto/generate-consultation-notes.dto';

@Injectable()
export class AiConsultationService {
  generateNotes(
    dto: GenerateConsultationNotesDto,
  ) {
    const assessment = `
Patient reports:
${dto.symptoms}

Clinical Notes:
${dto.doctorNotes || 'No additional notes'}

Likely condition requires clinical evaluation.
`;

    const plan = `
• Monitor symptoms
• Maintain hydration
• Adequate rest
• Follow doctor instructions
`;

    const medicines = `
• Paracetamol (if fever)
• Symptomatic treatment as required
`;

    const followUp = `
Review after 3-5 days if symptoms persist.
`;

    return {
      assessment: assessment.trim(),
      plan: plan.trim(),
      medicines: medicines.trim(),
      followUp: followUp.trim(),
    };
  }
}