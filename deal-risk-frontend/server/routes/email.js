import express from 'express';
import { sendEmail } from '../services/email.js';
import { sendSuccess } from '../utils/responseHelper.js';

const router = express.Router();

router.post('/send-email', async (req, res, next) => {
  try {
    const { to, subject, body } = req.body;
    await sendEmail({ to, subject, body });
    sendSuccess(res, { message: 'Email sent successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
