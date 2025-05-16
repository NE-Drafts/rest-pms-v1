import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.example.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'user@example.com';
const SMTP_PASS = process.env.SMTP_PASS || 'password';
const EMAIL_FROM = process.env.EMAIL_FROM || 'parking@example.com';

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * Send an email
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  return transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
};

/**
 * Send a reservation approval email
 */
export const sendApprovalEmail = async (
  to: string,
  date: string,
  slotCode: string
) => {
  const subject = 'Parking Reservation Approved';
  const text = `Your parking reservation for ${date} has been approved. Your assigned parking slot is ${slotCode}.`;
  const html = `
    <h1>Parking Reservation Approved</h1>
    <p>Your parking reservation for <strong>${date}</strong> has been approved.</p>
    <p>Your assigned parking slot is <strong>${slotCode}</strong>.</p>
    <p>Thank you for using our parking service!</p>
  `;

  return sendEmail(to, subject, text, html);
};

/**
 * Send a reservation rejection email
 */
export const sendRejectionEmail = async (
  to: string,
  date: string
) => {
  const subject = 'Parking Reservation Rejected';
  const text = `We regret to inform you that your parking reservation for ${date} has been rejected.`;
  const html = `
    <h1>Parking Reservation Rejected</h1>
    <p>We regret to inform you that your parking reservation for <strong>${date}</strong> has been rejected.</p>
    <p>Please contact the administrator if you have any questions.</p>
  `;

  return sendEmail(to, subject, text, html);
};
