import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmergencyProfile } from './emergency-profile.entity';
import { Patient } from '../patient/patient.entity';
import { FamilyMember } from '../family-member/family-member.entity';

import { EmergencyProfileService } from './emergency-profile.service';
import { EmergencyProfileController } from './emergency-profile.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmergencyProfile,
      Patient,
      FamilyMember,
    ]),
  ],
  controllers: [EmergencyProfileController],
  providers: [EmergencyProfileService],
  exports: [EmergencyProfileService],
})
export class EmergencyProfileModule {}