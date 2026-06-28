export class CreateAppointmentDto {
  doctorId: string;
  slotId: string;

  patientId?: string;
  familyMemberId?: string;

  patientName: string;
  patientPhone: string;
  symptoms?: string;
  appointmentType?: 'IN_PERSON' | 'VIDEO';
}