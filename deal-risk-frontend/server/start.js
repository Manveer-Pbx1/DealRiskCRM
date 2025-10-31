import app from './index.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

app.listen(config.PORT, () => {
  logger.info(`🚀 Dev API Server running on http://localhost:${config.PORT}`);
  logger.info(`📡 Ready to proxy Close API requests`);
});
