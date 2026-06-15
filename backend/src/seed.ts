import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Doctor } from './doctor/doctor.entity';
import { Hospital } from './hospital/hospital.entity';
import { Patient } from './patient/patient.entity';

async function bootstrap() {
  const app =
    await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  const doctorRepo = dataSource.getRepository(Doctor);
  const hospitalRepo = dataSource.getRepository(Hospital);
  const patientRepo = dataSource.getRepository(Patient);

  console.log('🧹 Cleaning database...');

  await dataSource.query(`TRUNCATE TABLE "slot" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "appointment" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "doctor_availability" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "doctor" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "hospital" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "patient" CASCADE`);

  console.log('✅ Database cleaned');

  const password = await bcrypt.hash('admin@123', 10);

  const cities = [
    'Chennai',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
  ];

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Neurology',
    'Pediatrics',
    'ENT',
    'General Physician',
    'Gynecology',
  ];

  const hospitals: Hospital[] = [];

  for (let i = 1; i <= 20; i++) {
    const city = cities[i % cities.length];

    const hospitalName = `MediCare Hospital ${i}`;

    const hospital = hospitalRepo.create({
      hospitalName,
      email: `hospital${i}@mail.com`,
      password,
      mobile: `9876543${String(i).padStart(3, '0')}`,
      city,
      state: 'India',
      address: `Main Road ${i}, ${city}`,
      licenseNumber: `LIC-MED-${1000 + i}`,
      isApproved: true,
      status: 'APPROVED',
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        hospitalName,
      )}&background=0ea5e9&color=fff&bold=true`,
    });

    const savedHospital =
      await hospitalRepo.save(hospital);

    hospitals.push(savedHospital);
  }

  console.log(`🏥 Hospitals created: ${hospitals.length}`);

  for (let i = 1; i <= 40; i++) {
    const hospital = hospitals[i % hospitals.length];
    const doctorName = `Dr Doctor ${i}`;

    const doctor = doctorRepo.create({
      doctorName,
      specialization:
        specializations[i % specializations.length],
      experience: Math.floor(Math.random() * 20) + 1,
      qualification: 'MBBS, MD',
      consultationFee:
        300 + Math.floor(Math.random() * 1000),
      mobile: `9000000${String(i).padStart(3, '0')}`,
      email: `doctor${i}@mail.com`,
      password,
      city: hospital.city,
      state: hospital.state,
      isActive: true,
      hospital,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        doctorName,
      )}&background=0891b2&color=fff&bold=true`,
    });

    await doctorRepo.save(doctor);
  }

  console.log('🧑‍⚕️ Doctors created: 40');

  for (let i = 1; i <= 30; i++) {
    const city = cities[i % cities.length];
    const patientName = `Patient ${i}`;

    const patient = patientRepo.create({
      fullName: patientName,
      email: `patient${i}@mail.com`,
      mobile: `8000000${String(i).padStart(3, '0')}`,
      password,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      age: 20 + (i % 40),
      city,
      isActive: true,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        patientName,
      )}&background=14b8a6&color=fff&bold=true`,
    });

    await patientRepo.save(patient);
  }

  console.log('👤 Patients created: 30');

  console.log('🎉 Seed completed successfully');
  console.log('Password for all users: admin@123');

  await app.close();
}

bootstrap();