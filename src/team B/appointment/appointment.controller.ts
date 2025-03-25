import { Controller, Post, Body } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('create')
  async create(@Body() data: Partial<Appointment>): Promise<Appointment> {
    return this.appointmentService.createAppointment(data);
  }
}
