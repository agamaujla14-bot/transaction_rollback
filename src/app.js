import express from 'express';
import accountsRouter from './routes/accounts.js';
import transactionRouter from './routes/transaction.js';
import logsRouter from './routes/logs.js';

const app = express();

// middleware
app.use(express.json());

// routes
app.use('/accounts', accountsRouter);
app.use('/transfer', transactionRouter);
app.use('/logs', logsRouter);

// simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// error handler
app.use((err, req, res, next) => {
  console.error('API error', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

export default app;
