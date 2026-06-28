import { IsOptional, IsString } from 'class-validator';

export class GenerateConsultationNotesDto {
  @IsString()
  symptoms: string;

  @IsOptional()
  @IsString()
  doctorNotes: string;

  @IsOptional()
  patientAge: number;

  @IsOptional()
  @IsString()
  specialization: string;
}