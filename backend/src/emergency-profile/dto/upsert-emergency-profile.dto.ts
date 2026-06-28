export class UpsertEmergencyProfileDto {
  patientId: string;
  familyMemberId?: string;

  bloodGroup?: string;
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceNumber?: string;
  organDonor?: boolean;
}