export class SearchDoctorDto {
  city?: string;
  specialization?: string;
  minExperience?: number;
  maxExperience?: number;
  minFee?: number;
  maxFee?: number;

  page?: number;
  limit?: number;
}