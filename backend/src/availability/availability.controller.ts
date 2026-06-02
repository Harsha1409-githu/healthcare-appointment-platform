import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  create(@Body() dto: CreateAvailabilityDto) {
    return this.availabilityService.createAvailability(dto);
  }

  @Get('doctor/:doctorId')
  getByDoctor(@Param('doctorId') doctorId: string) {
    return this.availabilityService.getAvailabilityByDoctor(doctorId);
  }
}