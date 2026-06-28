import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FamilyMember } from './family-member.entity';
import { Patient } from '../patient/patient.entity';
import { FamilyMemberService } from './family-member.service';
import { FamilyMemberController } from './family-member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyMember, Patient])],
  controllers: [FamilyMemberController],
  providers: [FamilyMemberService],
  exports: [FamilyMemberService],
})
export class FamilyMemberModule {}