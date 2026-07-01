import { RecommendationType } from '../enums/recommendation-type.enum';

export class CreateRecommendationDto {
  appointmentId: number;

  doctorId: string;

  patientId: string;

  type: RecommendationType;

  title: string;

  clinicalReason?: string;

  priority?: string;

  notes?: string;

  items: {
    name: string;
    category?: string;
    notes?: string;
    estimatedPrice?: number;
  }[];
}