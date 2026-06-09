import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Delete,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { DoctorService } from './doctor.service';
import { SearchDoctorDto } from './dto/search-doctor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
  ) {}

  @UseGuards(JwtAuthGuard)
@Patch('profile/photo')
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
  }),
)
uploadDoctorPhoto(
  @Req() req: any,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.doctorService.uploadDoctorPhoto(
    req.user.sub,
    file,
  );
}
  @Post('login')
  doctorLogin(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.doctorService.doctorLogin(
      body.email,
      body.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  getProfile(@Req() req: any) {
    return this.doctorService.getDoctorProfile(
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/me')
  updateProfile(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.doctorService.updateDoctorProfile(
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
  return this.doctorService.changePassword(
    req.user.sub,
    body.currentPassword,
    body.newPassword,
  );
}

  @Get('search')
  searchDoctors(@Query() query: SearchDoctorDto) {
    return this.doctorService.searchDoctors(query);
  }

  @Get(':id')
  getDoctorById(@Param('id') id: string) {
    return this.doctorService.getDoctorById(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.doctorService.createDoctor(body);
  }

  @Get()
  getAll() {
    return this.doctorService.getDoctors();
  }

  @Delete(':id')
  deleteDoctor(@Param('id') id: string) {
    return this.doctorService.deleteDoctor(id);
  }

  @Patch(':id/reactivate')
  reactivateDoctor(@Param('id') id: string) {
    return this.doctorService.reactivateDoctor(id);
  }
}