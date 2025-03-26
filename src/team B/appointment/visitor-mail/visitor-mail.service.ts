import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as QRCode from "qrcode";
import { createCanvas } from "canvas";
import * as fs from "fs";
import * as path from "path";
import { Appointment } from "../appointment.entity";
 
@Injectable()
export class VisitorMailService {
  private transporter: nodemailer.Transporter;
 
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'minimilitia1491@gmail.com',
        pass: 'haettvpiejqojvyk', // Ensure this is an App Password
      },
    });
  }
 
  async sendVisitorQRCode(appointment: Appointment): Promise<void> {
    try {
      const name = appointment.firstName + " " + (appointment.lastName || "");
      const email = appointment.visitorEmail || "No Email Provided";
      const phone = appointment.mobile_number || "No Phone Provided";
      const date = appointment.date || "No Date Provided";
      const time = appointment.allocatedTime || "No Time Provided";
      const nationalId = appointment.national_id || "No National ID Provided";
      const photo = appointment.photo ? "Photo Provided" : "No Photo Provided";
      const personalDetails = appointment.personal_details || "No Personal Details Provided";
      const note = appointment.note || "No Note Provided";
 
      // Well-formatted QR content with all fields (excluding the photo base64)
      const qrData = `
🟦══════════════════════════════🟦
        🎫 *VISITOR PASS*        
🟦══════════════════════════════🟦
👤 *Name:*            ${name}          
✉️ *Email:*           ${email}        
📞 *Phone:*           ${phone}        
📅 *Date:*            ${date}        
⏰ *Time:*            ${time}        
🆔 *National ID:*     ${nationalId}    
📸 *Photo:*           ${photo}        
ℹ️ *Personal Details:* ${personalDetails}
📝 *Note:*            ${note}        
🟦══════════════════════════════🟦
✅ *Show this pass at entry*  
📍 *Thank you for visiting!*  
🟦══════════════════════════════🟦
`;
 
      // Create a canvas for designing the Visitor Pass
      const canvas = createCanvas(400, 600);
      const ctx = canvas.getContext("2d");
 
      // Background color
      ctx.fillStyle = "#B3E5FC"; // Light Blue
      ctx.fillRect(0, 0, canvas.width, canvas.height);
 
      // Header Text
      ctx.fillStyle = "black";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("VISITOR PASS", canvas.width / 2, 50);
 
      // Generate QR Code
      const qrCanvas = createCanvas(300, 300);
      await QRCode.toCanvas(qrCanvas, qrData, { margin: 2 });
 
      // Place QR code in the center
      ctx.drawImage(qrCanvas, 50, 70, 300, 300);
 
      // Instruction text
      ctx.fillStyle = "black";
      ctx.font = "bold 16px Arial";
      ctx.fillText("Please show this QR code at the entrance", canvas.width / 2, 550);
 
      // Save final QR image
      const qrCodeFilePath = path.join(__dirname, `visitor-${appointment.id}.png`);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(qrCodeFilePath, buffer);
 
      // List of additional recipients (e.g., admins or staff)
      const additionalRecipients = [
        "endeldigital025@gmail.com",
        "parthvaishnav81@gmail.com",
        // Add more email addresses as needed
      ];
 
      // Combine visitor email with additional recipients
      const allRecipients = [appointment.visitorEmail, ...additionalRecipients].filter(Boolean);
 
      // Email Configuration for all recipients
      const mailOptions = {
        from: "minimilitia1491@gmail.com",
        to: allRecipients,
        subject: "Visitor QR Code - Appointment Details",
        html: `
          <p>Hello,</p>
          <p>A visitor has completed their appointment details. Below are the details:</p>
         
          ${appointment.photo ? `<p><strong>Photo:</strong></p><img src="cid:visitor-photo-${appointment.id}" alt="Visitor Photo" style="max-width: 200px; height: auto;" />` : '<p><strong>Photo:</strong> No Photo Provided</p>'}
          <p>Attached is the QR code for this visitor.</p>
          <p>Best Regards,<br>Your Company</p>
        `,
        attachments: [
          {
            filename: `Visitor_QR_${appointment.id}.png`,
            path: qrCodeFilePath,
            contentType: "image/png",
          },
          ...(appointment.photo
            ? [
                {
                  filename: `Visitor_Photo_${appointment.id}.png`,
                  content: Buffer.from(appointment.photo, 'base64'), // Convert base64 to buffer
                  cid: `visitor-photo-${appointment.id}`, // Content ID for inline image
                },
              ]
            : []),
        ],
      };
 
      await this.transporter.sendMail(mailOptions);
      console.log(`QR code email successfully sent to ${allRecipients.join(', ')}`);
 
      // Delete the temporary QR file after sending
      fs.unlinkSync(qrCodeFilePath);
    } catch (error) {
      console.error("Failed to send QR code email:", error);
      throw new InternalServerErrorException('Failed to send QR code email.');
    }
  }
}