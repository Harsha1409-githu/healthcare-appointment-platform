export class CreateFollowUpDto {
  doctorId: string;
  patientId: string;
  followUpDate: string;
  notes?: string;
  appointmentId: number;
}