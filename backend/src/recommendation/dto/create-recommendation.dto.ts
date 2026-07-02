import { RecommendationCategory } from '../enums/recommendation-category.enum';
import { RecommendationPriority } from '../enums/recommendation-priority.enum';
import { RecommendationServiceType } from '../enums/recommendation-service.enum';

export class CreateRecommendationDto {
  appointmentId: number;

  doctorId: string;

  patientId: string;

  category: RecommendationCategory;

  service: RecommendationServiceType;

  title: string;

  clinicalReason?: string;

  priority?: RecommendationPriority;

  notes?: string;

  estimatedCost?: number;

  items: {
    name: string;
    category?: string;
    notes?: string;
    estimatedPrice?: number;
  }[];
}