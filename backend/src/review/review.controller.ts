import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReviewDto, @Req() req: any) {
    return this.reviewService.createReview(dto, req.user.sub);
  }

  @Get('doctor/:doctorId')
  getByDoctor(@Param('doctorId') doctorId: string) {
    return this.reviewService.getReviewsByDoctor(doctorId);
  }

  @Get('doctor/:doctorId/summary')
  getSummary(@Param('doctorId') doctorId: string) {
    return this.reviewService.getDoctorRatingSummary(doctorId);
  }
}