import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { MailService } from '../mail/mail.service';
import { VisitorMailService } from './visitor-mail/visitor-mail.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly mailService: MailService,
    private readonly visitorMailService: VisitorMailService,
  ) {}

  async createOrUpdateAppointment(data: Partial<Appointment>): Promise<Appointment> {
    try {
      const existingAppointment = await this.appointmentRepo.findOne({
        where: {
          visitorEmail: data.visitorEmail,
          date: data.date,
          allocatedTime: data.allocatedTime,
        },
      });

      let savedAppointment: Appointment;

      if (existingAppointment) {
        // Update existing appointment (VisitorForm submission)
        savedAppointment = await this.appointmentRepo.save({
          ...existingAppointment,
          national_id: data.national_id || existingAppointment.national_id,
          photo: data.photo || existingAppointment.photo,
          mobile_number: data.mobile_number || existingAppointment.mobile_number,
          personal_details: data.personal_details || existingAppointment.personal_details,
          note: data.note || existingAppointment.note,
        });
        console.log(`✅ Updated appointment for ${savedAppointment.visitorEmail}`);

        // Log the appointment details before sending QR code email
        console.log('Appointment details before QR code generation:', savedAppointment);

        // Send QR code email only when updating (VisitorForm)
        await this.visitorMailService.sendVisitorQRCode(savedAppointment);
      } else {
        // Create new appointment (AppointmentForm submission)
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

        savedAppointment = await this.appointmentRepo.save(appointment);

        if (savedAppointment.visitorEmail && savedAppointment.date && savedAppointment.allocatedTime) {
          const formLink = `http://192.168.3.75:3000/#/theme/colors/VisitorForm?email=${encodeURIComponent(savedAppointment.visitorEmail)}&time=${encodeURIComponent(savedAppointment.allocatedTime)}&date=${encodeURIComponent(savedAppointment.date)}&firstName=${encodeURIComponent(savedAppointment.firstName || '')}&lastName=${encodeURIComponent(savedAppointment.lastName || '')}`;
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
      }

      return savedAppointment;
    } catch (error) {
      console.error('❌ Error creating/updating appointment:', error);
      throw new InternalServerErrorException('Failed to create or update appointment.');
    }
  }
}