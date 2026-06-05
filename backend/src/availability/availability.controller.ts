import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Post()
  create(@Body() dto: CreateAvailabilityDto) {
    return this.availabilityService.createAvailability(dto);
  }

  @Get('doctor/:doctorId')
  getByDoctor(@Param('doctorId') doctorId: string) {
    return this.availabilityService.getAvailabilityByDoctor(
      doctorId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateAvailabilityDto>,
  ) {
    return this.availabilityService.updateAvailability(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.availabilityService.deleteAvailability(id);
  }
}