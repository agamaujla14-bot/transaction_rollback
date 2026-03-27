import { transferFunds } from '../services/transactionService.js';
import { ApiError } from '../utils/errors.js';

export async function performTransfer(req, res, next) {
  try {
    const { fromId, toId, amount } = req.body;
    if (!fromId || !toId || typeof amount !== 'number') {
      throw new ApiError('fromId, toId and numeric amount required', 400);
    }
    const log = await transferFunds(fromId, toId, amount);
    res.json(log);
  } catch (err) {
    next(err);
  }
}
