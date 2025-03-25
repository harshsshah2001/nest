import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as QRCode from "qrcode";
import { createCanvas } from "canvas";
import { Visitor } from "./visitor.entity";
import * as fs from "fs";
import * as path from "path";

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
        pass: 'haettvpiejqojvyk',// Use an App Password instead of your actual password
      },
    });
  }

  async sendVisitorQRCode(visitor: Visitor): Promise<void> {
    try {
      const name = visitor.firstName + " " + (visitor.lastName || "");
      const email = visitor.email || "No Email Provided";
      const phone = visitor.phoneNumber || "No Phone Provided";
      const date = visitor.date || "No Date Provided";
      const time = visitor.allocationTime || "No Time Provided";

// Well-formatted QR content with better styling
const qrData = `
🟦══════════════════════════🟦
        🎫 *VISITOR PASS*        
🟦══════════════════════════🟦
👤 *Name:*  ${name}           
✉️ *Email:*  ${email}         
📞 *Phone:*  ${phone}         
📅 *Date:*  ${date}         
⏰ *Time:*  ${time}         
🟦══════════════════════════🟦
✅ *Show this pass at entry*  
📍 *Thank you for visiting!*  
🟦══════════════════════════🟦
`;



      // Create a canvas for designing the Visitor Pass
      const canvas = createCanvas(400, 500);
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
      ctx.fillText("Please show this QR code at the entrance", canvas.width / 2, 450);

      // Save final QR image
      const qrCodeFilePath = path.join(__dirname, `visitor-${visitor.id}.png`);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(qrCodeFilePath, buffer);

      // Email Configuration
      const mailOptions = {
        from: "minimilitia1491@gmail.com",
        to: visitor.email,
        subject: "Your Visitor QR Code",
        html: `
          <p>Hello ${visitor.firstName},</p>
          <p>Thank you for registering as a visitor. Attached is your QR code containing your details.</p>
          <p>Please bring this QR code to your appointment.</p>
          <p>Best Regards,<br>Your Company</p>
        `,
        attachments: [
          {
            filename: `Visitor_QR_${visitor.id}.png`,
            path: qrCodeFilePath,
            contentType: "image/png",
          },
        ],
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`QR code email successfully sent to ${visitor.email}`);

      // Delete the temporary QR file after sending
      fs.unlinkSync(qrCodeFilePath);
    } catch (error) {
      console.error("Failed to send QR code email:", error);
    }
  }
}