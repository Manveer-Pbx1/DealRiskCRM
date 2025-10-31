import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  logger.error(`${req.method} ${req.path} - ${status}: ${message}`, details);

  const errorResponse = { error: message };
  if (details) {
    errorResponse.details = details;
  }
  
  res.status(status).json(errorResponse);
};
