import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patient')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
  ) {}

  @Post('register')
  register(
    @Body() dto: CreatePatientDto,
  ) {
    return this.patientService.register(dto);
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  // =========================
  // GET PROFILE
  // =========================

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.patientService.getProfile(
      req.user.sub,
    );
  }

  // =========================
  // UPDATE PROFILE
  // =========================

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.patientService.updateProfile(
      req.user.sub,
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
@Patch('change-password')
changePassword(
  @Req() req: any,
  @Body()
  body: {
    currentPassword: string;
    newPassword: string;
  },
) {
  return this.patientService.changePassword(
    req.user.sub,
    body.currentPassword,
    body.newPassword,
  );
}

@Patch('profile/photo')
@UseGuards(JwtAuthGuard)
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
  }),
)
uploadPhoto(
  @Req() req: any,
  @UploadedFile() file: Express.Multer.File,
) {
 

  return this.patientService.uploadProfilePhoto(
    req.user.sub,
    file,
  );
}

}