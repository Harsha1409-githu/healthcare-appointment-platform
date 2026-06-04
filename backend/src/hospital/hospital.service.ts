import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Hospital } from './hospital.entity';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
  ) {}
  async getAllHospitals() {
  return this.hospitalRepository.find();
}
  async registerHospital(data: Partial<Hospital>) {
  const hashedPassword = await bcrypt.hash(data.password!, 10);

  

  const hospital = this.hospitalRepository.create({
    ...data,
    password: hashedPassword,
  });

  
  const savedHospital = await this.hospitalRepository.save(hospital);

  const { password, ...result } = savedHospital;
  

  return result;
  }
}