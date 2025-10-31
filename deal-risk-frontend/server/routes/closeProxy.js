import express from 'express';
import { getApiKey } from '../config/index.js';
import { fetchLeads, fetchEmailActivity } from '../services/closeApi.js';
import { sendSuccess } from '../utils/responseHelper.js';

const router = express.Router();

router.get('/close-proxy/lead', async (req, res, next) => {
  try {
    const apiKey = getApiKey(req);
    const data = await fetchLeads(req.query, apiKey);
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
});

router.get('/close-proxy/activity/email', async (req, res, next) => {
  try {
    const apiKey = getApiKey(req);
    const data = await fetchEmailActivity(req.query, apiKey);
    sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
});

export default router;
