import express from 'express';
import { listAccounts, createAccount } from '../controllers/accountsController.js';

const router = express.Router();

// GET /accounts - list all accounts
router.get('/', listAccounts);

// POST /accounts - create a new account
router.post('/', createAccount);

export default router;
