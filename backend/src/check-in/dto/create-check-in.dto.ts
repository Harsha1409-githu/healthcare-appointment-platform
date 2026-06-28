export class CreateCheckInDto {
  appointmentId: number;
  temperature?: string;
  bloodPressure?: string;
  weight?: string;
  symptoms?: string;
  notes?: string;
}