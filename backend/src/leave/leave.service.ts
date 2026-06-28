import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DoctorLeave } from './doctor-leave.entity';
import { Doctor } from '../doctor/doctor.entity';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(DoctorLeave)
    private leaveRepo: Repository<DoctorLeave>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  async create(dto: CreateLeaveDto) {
    const doctor = await this.doctorRepo.findOne({
      where: {
        id: dto.doctorId,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const leave = this.leaveRepo.create({
      doctor,
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason,
    });

    return this.leaveRepo.save(leave);
  }

  async getDoctorLeaves(doctorId: string) {
    return this.leaveRepo.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      relations: {
        doctor: true,
      },
      order: {
        startDate: 'DESC',
      },
    });
  }

  async delete(id: string) {
    const leave = await this.leaveRepo.findOne({
      where: { id },
    });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    await this.leaveRepo.delete(id);

    return {
      message: 'Leave deleted successfully',
    };
  }
  async isDoctorOnLeave(doctorId: string, date: string) {
  const leave = await this.leaveRepo
    .createQueryBuilder('leave')
    .leftJoinAndSelect('leave.doctor', 'doctor')
    .where('doctor.id = :doctorId', { doctorId })
    .andWhere(':date BETWEEN leave.startDate AND leave.endDate', {
      date,
    })
    .getOne();

  return {
    onLeave: !!leave,
    leave,
  };
}
}