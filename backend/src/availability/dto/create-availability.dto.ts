import { SlotType } from '../../slot/slot.entity';

export class CreateAvailabilityDto {
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDuration?: number;
  slotType?: SlotType;
}