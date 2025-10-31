import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://deal-risk-analyst.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
    }

    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
    const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const EMAIL_FROM = process.env.EMAIL_FROM || `"DealRisk CRM" <${SMTP_USER}>`;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: to,
      subject: subject,
      text: body,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', result.messageId);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message 
    });
  }
}
