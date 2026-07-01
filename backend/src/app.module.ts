import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HospitalModule } from './hospital/hospital.module';
import { Hospital } from './hospital/hospital.entity';

import { DoctorModule } from './doctor/doctor.module';
import { Doctor } from './doctor/doctor.entity';

import { AuthModule } from './auth/auth.module';

import { SlotModule } from './slot/slot.module';
import { Slot } from './slot/slot.entity';

import { AppointmentModule } from './appointment/appointment.module';
import { Appointment } from './appointment/appointment.entity';

import { PatientModule } from './patient/patient.module';
import { Patient } from './patient/patient.entity';

import { AvailabilityModule } from './availability/availability.module';
import { DoctorAvailability } from './availability/doctor-availability.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './review/review.entity';
import { PaymentModule } from './payment/payment.module';
import { MailModule } from './mail/mail.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { Prescription } from './prescription/prescription.entity';
import { AdminModule } from './admin/admin.module';

import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/notification.entity';
import { SymptomHistoryModule } from './symptom-history/symptom-history.module';
import { SymptomHistory } from './symptom-history/symptom-history.entity';
import { MedicalRecordModule } from './medical-record/medical-record.module';
import { MedicalRecord } from './medical-record/medical-record.entity';
import { MedicineReminder } from './medicine-reminder/medicine-reminder.entity';
import { MedicineReminderModule } from './medicine-reminder/medicine-reminder.module';
import { LabTestModule } from './lab-test/lab-test.module';
import { LabTest } from './lab-test/lab-test.entity';
import { LabOrder } from './lab-test/lab-order.entity';
import { LabOrderItem } from './lab-test/lab-order-item.entity';
import { ChatModule } from './chat/chat.module';
import { ChatMessage } from './chat/chat-message.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { FollowUpModule } from './follow-up/follow-up.module';
import { FollowUp } from './follow-up/follow-up.entity';
import { LeaveModule } from './leave/leave.module';
import { DoctorLeave } from './leave/doctor-leave.entity';
import { AiConsultationModule } from './ai-consultation/ai-consultation.module';
import { FamilyMemberModule } from './family-member/family-member.module';
import { FamilyMember } from './family-member/family-member.entity';
import { EmergencyProfileModule } from './emergency-profile/emergency-profile.module';
import { EmergencyProfile } from './emergency-profile/emergency-profile.entity';
import { CheckInModule } from './check-in/check-in.module';
import { CheckIn } from './check-in/check-in.entity';
import { Consultation } from './consultation/consultation.entity';
import { ConsultationModule } from './consultation/consultation.module';
import { RecommendationModule } from './recommendation/recommendation.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

   ssl:
  process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,


      entities: [
        Hospital,
        Doctor,
        Slot,
        Appointment,
        Patient,
        DoctorAvailability,
        Review,
        Prescription,
        Notification,
        SymptomHistory,
        MedicalRecord,
        MedicineReminder,
        LabTest,
        LabOrder,
        LabOrderItem,
        ChatMessage,  
        FollowUp,
        DoctorLeave,
        FamilyMember,
        EmergencyProfile,
        CheckIn,
        Consultation,
   
      ],

      synchronize: true,
    }),

    HospitalModule,
    DoctorModule,
    AuthModule,
    SlotModule,
    AppointmentModule,
    PatientModule,
    AvailabilityModule,
    ReviewModule,
    PaymentModule,
    MailModule,
    PrescriptionModule,
    AdminModule,
    NotificationModule,
    SymptomHistoryModule,
    MedicalRecordModule,
    MedicineReminderModule,
    LabTestModule,
    ChatModule,
    FollowUpModule,
    LeaveModule,
    AiConsultationModule,
    FamilyMemberModule,
    EmergencyProfileModule,
    CheckInModule,
    ConsultationModule,
    RecommendationModule, 
  ],

  controllers: [AppController],  // ✅ FIX
  providers: [AppService],       // ✅ FIX
})
export class AppModule {}