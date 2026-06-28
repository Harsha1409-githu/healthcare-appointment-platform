import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotType } from './slot.entity';

@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post('generate')
  generate(
    @Body()
    body: {
      doctorId: string;
      date: string;
      slotType?: SlotType;
    },
  ) {
    return this.slotService.generateSlotsForDoctor(
      body.doctorId,
      body.date,
     
    );
  }

  @Get('doctor/:doctorId')
  getByDoctor(@Param('doctorId') doctorId: string) {
    return this.slotService.getSlotsByDoctor(doctorId);
  }

  @Get('doctor/:doctorId/available')
  getAvailable(
    @Param('doctorId') doctorId: string,
    @Query('type') type?: SlotType,
  ) {
    return this.slotService.getAvailableSlots(doctorId, type);
  }
}