import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabTest } from './lab-test.entity';
import { LabTestService } from './lab-test.service';
import { LabTestController } from './lab-test.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LabTest])],
  providers: [LabTestService],
  controllers: [LabTestController],
})
export class LabTestModule {}