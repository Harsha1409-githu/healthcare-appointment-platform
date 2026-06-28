export class CreateFamilyMemberDto {
  patientId: string;
  fullName: string;
  relation: string;
  gender?: string;
  age?: number;
  bloodGroup?: string;
  mobile?: string;
  profileImage?: string;
}