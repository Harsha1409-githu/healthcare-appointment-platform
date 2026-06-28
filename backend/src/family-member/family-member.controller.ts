import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { FamilyMemberService } from './family-member.service';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';

@Controller('family-member')
export class FamilyMemberController {
  constructor(
    private readonly familyMemberService: FamilyMemberService,
  ) {}

  @Post()
  create(@Body() dto: CreateFamilyMemberDto) {
    return this.familyMemberService.create(dto);
  }

  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.familyMemberService.findByPatient(patientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familyMemberService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFamilyMemberDto,
  ) {
    return this.familyMemberService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.familyMemberService.delete(id);
  }
}