import nodemailer from "nodemailer";
import { User } from "@shared/schema";

// Create a test account if no email credentials are provided
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const createTransporter = async () => {
  if (!process.env.EMAIL_HOST) {
    return createTestAccount();
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendWelcomeEmail = async (user: User) => {
  const transporter = await createTransporter();
  
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Customer Service Portal" <support@example.com>',
    to: user.email,
    subject: "Welcome to Customer Service Portal",
    text: `Hello ${user.displayName},\n\nWelcome to Customer Service Portal! Your account has been successfully created.\n\nBest regards,\nCustomer Service Team`,
    html: `
      <h1>Welcome to Customer Service Portal!</h1>
      <p>Hello ${user.displayName},</p>
      <p>Your account has been successfully created.</p>
      <p>Best regards,<br>Customer Service Team</p>
    `,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
};

export const sendProfileUpdateEmail = async (user: User) => {
  const transporter = await createTransporter();
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Customer Service Portal" <support@example.com>',
    to: user.email,
    subject: "Profile Updated",
    text: `Hello ${user.displayName},\n\nYour profile has been successfully updated.\n\nBest regards,\nCustomer Service Team`,
    html: `
      <h1>Profile Updated</h1>
      <p>Hello ${user.displayName},</p>
      <p>Your profile has been successfully updated.</p>
      <p>Best regards,<br>Customer Service Team</p>
    `,
  });
};
