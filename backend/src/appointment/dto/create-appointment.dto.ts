import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  doctorId: string;
  slotId: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  symptoms?: string;
}