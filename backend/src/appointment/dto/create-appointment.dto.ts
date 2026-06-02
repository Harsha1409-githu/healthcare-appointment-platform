import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsString()
  doctorId: string;

  
  @IsString()
  slotId: string;

  @IsString()
  patientName: string;

  @IsString()
  patientPhone: string;

  

}