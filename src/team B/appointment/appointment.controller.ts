import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('photo'))
  async createOrUpdate(
    @Body() data: Partial<Appointment>,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<Appointment> {
    return this.appointmentService.createOrUpdateAppointment({
      ...data,
      photo: photo ? photo.buffer.toString('base64') : data.photo, // Convert buffer to base64 string
    });
  }
}