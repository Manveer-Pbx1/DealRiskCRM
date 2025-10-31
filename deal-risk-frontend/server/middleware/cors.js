import cors from 'cors';
import { config } from '../config/index.js';

const allowedOrigins = [
  config.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
  'https://deal-risk-analyst.vercel.app'
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
});
