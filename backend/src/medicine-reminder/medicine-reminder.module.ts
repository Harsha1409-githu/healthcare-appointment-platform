import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicineReminder } from './medicine-reminder.entity';
import { MedicineReminderService } from './medicine-reminder.service';
import { MedicineReminderController } from './medicine-reminder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicineReminder])],
  providers: [MedicineReminderService],
  controllers: [MedicineReminderController],
  exports: [MedicineReminderService],
})
export class MedicineReminderModule {}
