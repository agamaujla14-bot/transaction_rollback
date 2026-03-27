import Account from '../models/Account.js';
import { ApiError } from '../utils/errors.js';

export async function listAccounts(req, res, next) {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
}

export async function createAccount(req, res, next) {
  try {
    const { name, balance } = req.body;
    if (balance < 0) {
      throw new ApiError('Balance must be non-negative', 400);
    }
    const acc = new Account({ name, balance });
    await acc.save();
    res.status(201).json(acc);
  } catch (err) {
    next(err);
  }
}
