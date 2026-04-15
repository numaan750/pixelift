import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetCodeEmail = async (email, resetCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Code - Home-Aura",
    html: `<h2>Your reset code: ${resetCode}</h2>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email send failed:", error);
  }
};
