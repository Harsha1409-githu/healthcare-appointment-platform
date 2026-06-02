import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePrescriptionDto {
  @IsNumber()
  appointmentId: number;

  @IsString()
  diagnosis: string;

  @IsString()
  medicines: string;

  @IsOptional()
  @IsString()
  notes?: string;
}