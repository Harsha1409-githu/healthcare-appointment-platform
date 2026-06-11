import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SymptomHistoryService } from './symptom-history.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('symptom-history')
export class SymptomHistoryController {
  constructor(
    private readonly symptomHistoryService: SymptomHistoryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.symptomHistoryService.create(
      req.user.sub,
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyHistory(@Req() req: any) {
    return this.symptomHistoryService.getMyHistory(
      req.user.sub,
    );
  }
}