import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Doctor } from './doctor/doctor.entity';
import { Hospital } from './hospital/hospital.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  const doctorRepo = dataSource.getRepository(Doctor);
  const hospitalRepo = dataSource.getRepository(Hospital);

  console.log('🧹 Cleaning database...');

  // ✅ SAFE RESET (no foreign key issues)
  await dataSource.query(`TRUNCATE TABLE "slot" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "appointment" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "doctor_availability" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "doctor" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "hospital" CASCADE`);

  console.log('✅ Database cleaned');

  const cities = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Neurology',
    'Pediatrics',
    'ENT',
    'General Physician',
  ];

  const hospitals: Hospital[] = [];

  // 🏥 CREATE HOSPITALS (FIXED: password added)
  for (let i = 1; i <= 10; i++) {
    const hospital = hospitalRepo.create({
      hospitalName: `Hospital ${i}`,
      email: `hospital${i}@mail.com`,
      password: 'admin@123', // ✅ FIXED REQUIRED FIELD
      mobile: `98765432${i}0`,
      city: cities[i % cities.length],
      state: 'India',
      address: `Street ${i}`,
      isApproved: true,
    });

    const savedHospital = await hospitalRepo.save(hospital);
    hospitals.push(savedHospital);
  }

  console.log(`🏥 Hospitals created: ${hospitals.length}`);

  // 🧑‍⚕️ CREATE DOCTORS
  for (let i = 1; i <= 30; i++) {
    const doctor = doctorRepo.create({
      doctorName: `Dr Doctor ${i}`,
      specialization: specializations[i % specializations.length],
      experience: Math.floor(Math.random() * 20) + 1,
      qualification: 'MBBS, MD',
      consultationFee: 300 + Math.floor(Math.random() * 1000),
      mobile: `90000000${i}`,
      email: `doctor${i}@mail.com`,
      city: cities[i % cities.length],
      state: 'India',
      isActive: true,
      hospital: hospitals[i % hospitals.length],
    });

    await doctorRepo.save(doctor);
  }

  console.log('🎉 30 doctors created successfully');

  await app.close();
}

bootstrap();