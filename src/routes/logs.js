import express from 'express';
import { listLogs } from '../controllers/logsController.js';

const router = express.Router();

// GET /logs - list all transaction logs
router.get('/', listLogs);

export default router;
