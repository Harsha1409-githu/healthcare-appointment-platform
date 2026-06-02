import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Delete,
} from '@nestjs/common';

import { DoctorService } from './doctor.service';
import { SearchDoctorDto } from './dto/search-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
  ) {}

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
}