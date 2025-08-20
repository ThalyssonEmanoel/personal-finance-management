import nodemailer from "nodemailer";
import 'dotenv/config';

export const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.HOST,
        pass: process.env.PASS
      },
    });

    transporter.sendMail({
      from: process.env.HOST,
      to: email,
      subject: subject,
      html: message
    });
  } catch (error) {
    return error;
  }
};
