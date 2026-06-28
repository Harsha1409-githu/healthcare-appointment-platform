import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Doctor } from './doctor/doctor.entity';
import { Hospital } from './hospital/hospital.entity';
import { Patient } from './patient/patient.entity';
import { Slot } from './slot/slot.entity';
import { Appointment } from './appointment/appointment.entity';
import { Review } from './review/review.entity';
import { FollowUp } from './follow-up/follow-up.entity';
import { Prescription } from './prescription/prescription.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const hospitalRepo = dataSource.getRepository(Hospital);
  const doctorRepo = dataSource.getRepository(Doctor);
  const patientRepo = dataSource.getRepository(Patient);
  const slotRepo = dataSource.getRepository(Slot);
  const appointmentRepo = dataSource.getRepository(Appointment);
  const reviewRepo = dataSource.getRepository(Review);
  const followUpRepo = dataSource.getRepository(FollowUp);
  const prescriptionRepo = dataSource.getRepository(Prescription);

  console.log('🧹 Cleaning database...');

  await dataSource.query(`TRUNCATE TABLE "prescription" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "follow_up" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "review" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "appointment" CASCADE`);
  await dataSource.query(`TRUNCATE TABLE "slot" CASCADE`);
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
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Coimbatore',
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
    'Psychiatry',
    'Dentist',
    'Urology',
    'Ophthalmology',
    'Pulmonology',
    'Endocrinology',
    'Oncology',
  ];

  const hospitals: Hospital[] = [];
  const doctors: Doctor[] = [];
  const patients: Patient[] = [];
  const slots: Slot[] = [];
  const appointments: Appointment[] = [];

  for (let i = 1; i <= 10; i++) {
    const city = cities[(i - 1) % cities.length];
    const hospitalName = `TryDoc Hospital ${i}`;

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
    } as any);

    const savedHospital = (await hospitalRepo.save(
      hospital,
    )) as unknown as Hospital;

    hospitals.push(savedHospital);
  }

  console.log('🏥 Hospitals created: 10');

  for (let i = 1; i <= 30; i++) {
    const hospital = hospitals[(i - 1) % hospitals.length];
    const doctorName = `Dr Doctor ${i}`;

    const doctor = doctorRepo.create({
      doctorName,
      specialization: specializations[(i - 1) % specializations.length],
      experience: Math.floor(Math.random() * 20) + 1,
      qualification: 'MBBS, MD',
      consultationFee: 300 + Math.floor(Math.random() * 1000),
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
    } as any);

    const savedDoctor = (await doctorRepo.save(
      doctor,
    )) as unknown as Doctor;

    doctors.push(savedDoctor);
  }

  console.log('🧑‍⚕️ Doctors created: 30');

  for (let i = 1; i <= 60; i++) {
    const city = cities[(i - 1) % cities.length];
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
    } as any);

    const savedPatient = (await patientRepo.save(
      patient,
    )) as unknown as Patient;

    patients.push(savedPatient);
  }

  console.log('👤 Patients created: 60');

  const startTimes = ['09:00', '10:00', '11:00', '15:00', '16:00'];

  for (let i = 0; i < 150; i++) {
    const doctor = doctors[i % doctors.length];
    const dayOffset = Math.floor(i / 10);

    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    const dateText = date.toISOString().split('T')[0];
    const startTime = startTimes[i % startTimes.length];

    const endHour = Number(startTime.split(':')[0]) + 1;
    const endTime = `${String(endHour).padStart(2, '0')}:00`;

    const slot = slotRepo.create({
      doctor,
      date: dateText,
      startTime,
      endTime,
      isAvailable: i >= 80,
    } as any);

    const savedSlot = (await slotRepo.save(
      slot,
    )) as unknown as Slot;

    slots.push(savedSlot);
  }

  console.log('🕒 Slots created: 150');

  for (let i = 0; i < 80; i++) {
    const slot = slots[i];
    const doctor = doctors[i % doctors.length];
    const patient = patients[i % patients.length];

    let status = 'BOOKED';

    if (i < 35) {
      status = 'COMPLETED';
    }

    if (i >= 70) {
      status = 'CANCELLED';
    }

    const appointment = appointmentRepo.create({
      doctor,
      patient,
      slot,
      patientName: patient.fullName,
      patientPhone: patient.mobile,
      status,
      consultationFee: doctor.consultationFee,
      paymentStatus: status === 'CANCELLED' ? 'REFUNDED' : 'PAID',
      videoRoomId: `ROOM-${10000 + i}`,
    } as any);

    const savedAppointment =
      (await appointmentRepo.save(
        appointment,
      )) as unknown as Appointment;

    appointments.push(savedAppointment);
  }

  console.log('📅 Appointments created: 80');

  for (let i = 0; i < 50; i++) {
    const doctor = doctors[i % doctors.length];
    const patient = patients[(i + 3) % patients.length];

    const review = reviewRepo.create({
      doctor,
      patient,
      rating: 3 + (i % 3),
      comment:
        i % 2 === 0
          ? 'Good consultation and clear explanation.'
          : 'Doctor was helpful and professional.',
    } as any);

    await reviewRepo.save(review);
  }

  console.log('⭐ Reviews created: 50');

  for (let i = 0; i < 40; i++) {
    const doctor = doctors[i % doctors.length];
    const patient = patients[(i + 5) % patients.length];

    const followDate = new Date();
    followDate.setDate(followDate.getDate() + 2 + (i % 20));

    const followUp = followUpRepo.create({
      doctor,
      patient,
      followUpDate: followDate.toISOString().split('T')[0],
      notes:
        i % 2 === 0
          ? 'Review medicine progress and symptoms.'
          : 'Follow-up consultation for health check.',
      status: i < 32 ? 'PENDING' : 'COMPLETED',
    } as any);

    await followUpRepo.save(followUp);
  }

  console.log('🔁 Follow-ups created: 40');

  const completedAppointments = appointments.filter(
    (item: any) => item.status === 'COMPLETED',
  );

  for (let i = 0; i < 20; i++) {
    const appointment: any =
      completedAppointments[i % completedAppointments.length];

    const prescription = prescriptionRepo.create({
      appointment,
      doctor: appointment.doctor,
      patient: appointment.patient,
      diagnosis:
        i % 2 === 0
          ? 'Viral fever with mild body pain'
          : 'Routine consultation with minor symptoms',
      medicines:
        i % 2 === 0
          ? 'Paracetamol 500mg - twice daily after food\nVitamin C - once daily'
          : 'Cetirizine 10mg - once at night\nSteam inhalation - twice daily',
      notes:
        'Drink plenty of water. Take rest. Follow-up if symptoms continue.',
    } as any);

    await prescriptionRepo.save(prescription);
  }

  console.log('💊 Prescriptions created: 20');

  console.log('🎉 Seed completed successfully');
  console.log('Password for all users: admin@123');
  console.log('Example hospital: hospital1@mail.com');
  console.log('Example doctor: doctor1@mail.com');
  console.log('Example patient: patient1@mail.com');

  await app.close();
}

bootstrap();