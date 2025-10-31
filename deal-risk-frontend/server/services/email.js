import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, body }) => {
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    const error = new Error('Email service not configured');
    error.status = 500;
    throw error;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: config.EMAIL_FROM || `"DealRisk CRM" <${config.SMTP_USER}>`,
      to: to,
      subject: subject,
      text: body,
    };

    const result = await transporter.sendMail(mailOptions);
    
    logger.info('Email sent successfully:', result.messageId);
    return result;
  } catch (err) {
    logger.error('Email sending error:', err);
    const error = new Error('Failed to send email');
    error.status = 500;
    error.details = err.message;
    throw error;
  }
};
