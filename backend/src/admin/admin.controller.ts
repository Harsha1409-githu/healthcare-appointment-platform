import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Post('login')
  login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.adminService.login(
      body.email,
      body.password,
    );
  }

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('hospitals')
  getHospitals() {
    return this.adminService.getHospitals();
  }

  @Get('doctors')
getDoctors() {
  return this.adminService.getDoctors();
}

@Patch('doctor/:id/activate')
activateDoctor(@Param('id') id: string) {
  return this.adminService.activateDoctor(id);
}

@Patch('doctor/:id/deactivate')
deactivateDoctor(@Param('id') id: string) {
  return this.adminService.deactivateDoctor(id);
}

  @Patch('hospital/:id/approve')
  approveHospital(@Param('id') id: string) {
    return this.adminService.approveHospital(id);
  }

  @Patch('hospital/:id/reject')
  rejectHospital(@Param('id') id: string) {
    return this.adminService.rejectHospital(id);

    
  }
}