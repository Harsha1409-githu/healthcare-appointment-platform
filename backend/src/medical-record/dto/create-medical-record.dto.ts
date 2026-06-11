import { RecordType } from '../medical-record.entity';

export class CreateMedicalRecordDto {
  title: string;
  recordType: RecordType;
  fileUrl: string;
  fileName?: string;
}