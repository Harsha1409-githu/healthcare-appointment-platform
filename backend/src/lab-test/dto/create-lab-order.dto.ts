export class CreateLabOrderDto {
  patientId: string;

  familyMemberId?: string;

  preferredDate: string;

  preferredTime: string;

  address: string;

  tests: {
    testName: string;
    category: string;
    price: number;
  }[];
}