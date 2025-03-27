// mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  sendAppointmentEmail(visitorEmail: string, date: string, allocatedTime: string) {
    throw new Error('Method not implemented.');
  }
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'minimilitia1491@gmail.com',
        pass: 'haettvpiejqojvyk', // Ensure this is an App Password if 2FA is enabled
      },
    });
  }

  async sendRegistrationEmail(email: string, name: string, userId: number) {
    const confirmationLink = `http://192.168.3.75:3001/event-details/${userId}`; // Unique link with user ID
    const mailOptions = {
      from: 'minimilitia1491@gmail.com',
      to: email,
      subject: 'Welcome to Our Application!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for registering with us.</p>
        <p>Your account has been successfully created.</p>
       
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}