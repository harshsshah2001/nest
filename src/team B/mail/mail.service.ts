import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: "parthvaishnav81@gmail.com",
      pass: "kxrmujnjumcitrds",
    },
  });

  async sendAppointmentEmail(visitorEmail: string, date: string, allocatedTime: string, formLink: string) {
    const mailOptions = {
      from: `"Endel Digital" <parthvaishnav81@gmail.com>`,
      to: visitorEmail,
      subject: "Your Appointment Details",
      html: `<p>Your appointment is scheduled for <strong>${date}</strong> at <strong>${allocatedTime}</strong>.</p>
             <p>Click <a href="${formLink}">here</a> to complete your details.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email successfully sent to ${visitorEmail}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${visitorEmail}:`, error);
      throw new InternalServerErrorException('Failed to send appointment email.');
    }
  }
}