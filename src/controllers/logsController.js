import TransactionLog from '../models/TransactionLog.js';

export async function listLogs(req, res, next) {
  try {
    const logs = await TransactionLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    next(err);
  }
}
