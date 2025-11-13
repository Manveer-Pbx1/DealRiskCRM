import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import closeProxyRouter from './routes/closeProxy.js';
import emailRouter from './routes/email.js';
import healthRouter from './routes/health.js';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api', closeProxyRouter);
app.use('/api', emailRouter);
app.use('/', healthRouter);

app.use(errorHandler);

export default app;
