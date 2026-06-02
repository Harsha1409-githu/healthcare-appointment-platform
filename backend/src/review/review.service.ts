import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './review.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async createReview(dto: CreateReviewDto, patientId: string) {
    const doctor = await this.doctorRepo.findOne({
      where: { id: dto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const patient = await this.patientRepo.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const review = this.reviewRepo.create({
      doctor,
      patient,
      rating: dto.rating,
      comment: dto.comment,
    });

    return this.reviewRepo.save(review);
  }

  async getReviewsByDoctor(doctorId: string) {
    return this.reviewRepo.find({
      where: {
        doctor: { id: doctorId },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getDoctorRatingSummary(doctorId: string) {
    const reviews = await this.getReviewsByDoctor(doctorId);

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : reviews.reduce((sum, item) => sum + item.rating, 0) /
          totalReviews;

    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
    };
  }
}