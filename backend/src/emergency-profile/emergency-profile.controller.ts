import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { EmergencyProfileService } from './emergency-profile.service';
import { UpsertEmergencyProfileDto } from './dto/upsert-emergency-profile.dto';

@Controller('emergency-profile')
export class EmergencyProfileController {
  constructor(
    private readonly emergencyProfileService: EmergencyProfileService,
  ) {}

  @Get('patient/:patientId')
  getByPatient(@Param('patientId') patientId: string) {
    return this.emergencyProfileService.getByPatient(patientId);
  }

  @Get('patient/:patientId/selected')
  getSelected(
    @Param('patientId') patientId: string,
    @Query('familyMemberId') familyMemberId?: string,
  ) {
    return this.emergencyProfileService.getSelectedProfile(
      patientId,
      familyMemberId,
    );
  }

  @Post()
  upsert(@Body() dto: UpsertEmergencyProfileDto) {
    return this.emergencyProfileService.upsert(dto);
  }
}