import 'dotenv/config';

export const config = {
  PORT: process.env.PORT || 3001,
  CLOSE_API_BASE_URL: process.env.VITE_CLOSE_API_BASE_URL || 'https://api.close.com/api/v1',
  DEFAULT_CLOSE_API_KEY: process.env.VITE_CLOSE_API_KEY || null,
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export const getApiKey = (req) => {
  return req.headers['x-close-api-key'] || config.DEFAULT_CLOSE_API_KEY;
};
