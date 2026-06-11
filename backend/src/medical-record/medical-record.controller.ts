import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UploadedFile,
UseInterceptors,
BadRequestException,
} from '@nestjs/common';

import { MedicalRecordService } from './medical-record.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';  

@Controller('medical-record')
export class MedicalRecordController {
  constructor(
    private readonly medicalRecordService: MedicalRecordService,
  ) {}

  @UseGuards(JwtAuthGuard)
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadMedicalRecordFile(
  @UploadedFile() file: Express.Multer.File,
) {
  if (!file) {
    throw new BadRequestException('File is required');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'medical-records',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

  return {
    fileUrl: result.secure_url,
    fileName: file.originalname,
  };
}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateMedicalRecordDto) {
    return this.medicalRecordService.create(
      req.user.sub,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyRecords(@Req() req: any) {
    return this.medicalRecordService.getMyRecords(
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteRecord(@Param('id') id: string, @Req() req: any) {
    return this.medicalRecordService.deleteRecord(
      Number(id),
      req.user.sub,
    );
  }
}