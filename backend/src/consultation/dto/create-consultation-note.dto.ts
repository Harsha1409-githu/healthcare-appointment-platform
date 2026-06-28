export class CreateConsultationNoteDto {
  appointmentId: number;
   doctorId: string;
  diagnosis: string;
  doctorNotes?: string;
  advice?: string;
  followUpRequired?: boolean;
}