import express from 'express';
import { performTransfer } from '../controllers/transactionController.js';

const router = express.Router();

// POST /transfer - body: { fromId, toId, amount }
router.post('/', performTransfer);

export default router;
