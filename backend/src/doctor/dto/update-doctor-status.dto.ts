import { DoctorLiveStatus } from '../doctor.entity';

export class UpdateDoctorStatusDto {
  status: DoctorLiveStatus;
  blockedUntil?: Date | null;
}