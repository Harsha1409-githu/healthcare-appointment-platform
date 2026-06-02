import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SlotService } from './slot.service';

@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post('generate')
  generate(@Body() body: { doctorId: string; date: string }) {
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
  getAvailable(@Param('doctorId') doctorId: string) {
    return this.slotService.getAvailableSlots(doctorId);
  }
}