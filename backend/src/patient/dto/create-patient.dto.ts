import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  fullName: string;

  @IsString()
  mobile: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  city?: string;
}