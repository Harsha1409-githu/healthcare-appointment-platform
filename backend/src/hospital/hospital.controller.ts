import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';

import { HospitalService } from './hospital.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('hospital')
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.hospitalService.registerHospital(body);
  }

  @Get()
  async getAll() {
    return this.hospitalService.getAllHospitals();
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    return this.hospitalService.getDashboard(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('doctors')
  async getMyDoctors(@Req() req: any) {
    return this.hospitalService.getMyDoctors(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  async getProfile(@Req() req: any) {
    return this.hospitalService.getHospitalProfile(
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/me')
  async updateProfile(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.hospitalService.updateHospitalProfile(
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
  return this.hospitalService.changePassword(
    req.user.sub,
    body.currentPassword,
    body.newPassword,
  );
}
@UseGuards(JwtAuthGuard)
@Patch('profile/photo')
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
  }),
)
uploadHospitalPhoto(
  @Req() req: any,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.hospitalService.uploadHospitalPhoto(
    req.user.sub,
    file,
  );
}

@Patch(':id/approve')
approveHospital(@Param('id') id: string) {
  return this.hospitalService.approveHospital(id);
}

@Patch(':id/reject')
rejectHospital(@Param('id') id: string) {
  return this.hospitalService.rejectHospital(id);
}
}