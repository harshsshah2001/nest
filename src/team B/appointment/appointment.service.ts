import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly mailService: MailService,
  ) {}

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    try {
      const appointment = this.appointmentRepo.create({
        firstName: data.firstName,
        lastName: data.lastName,
        date: data.date,
        allocatedTime: data.allocatedTime,
        visitorEmail: data.visitorEmail,
        national_id: data.national_id,
        photo: data.photo,
        mobile_number: data.mobile_number,
        personal_details: data.personal_details,
        note: data.note,
      });

      const savedAppointment = await this.appointmentRepo.save(appointment);

      if (savedAppointment.visitorEmail && savedAppointment.date && savedAppointment.allocatedTime) {
        const formLink = `http://localhost:3000/#/theme/colors/VisitorForm?email=${encodeURIComponent(savedAppointment.visitorEmail)}&time=${encodeURIComponent(savedAppointment.allocatedTime)}&date=${encodeURIComponent(savedAppointment.date)}&firstName=${encodeURIComponent(savedAppointment.firstName || '')}&lastName=${encodeURIComponent(savedAppointment.lastName || '')}`;
        await this.mailService.sendAppointmentEmail(
          savedAppointment.visitorEmail,
          savedAppointment.date,
          savedAppointment.allocatedTime,
          formLink,
        );
        console.log(`📩 Email sent to ${savedAppointment.visitorEmail} with form link: ${formLink}`);
      } else {
        console.log('⚠️ Email not sent: Missing required fields (visitorEmail, date, or allocatedTime)');
      }

      return savedAppointment;
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      throw new InternalServerErrorException('Failed to create appointment.');
    }
  }
}