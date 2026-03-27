import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import Account from './src/models/Account.js';
import { connectDB, disconnectDB } from './src/config/db.js';

async function main() {
  try {
    await connectDB();

    // start HTTP server
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    const server = app.listen(port, host, () => {
      console.log(`✓ API server listening on port ${port}`);
      console.log(`✓ Health check: GET /health`);
      console.log(`✓ Accounts API: GET /accounts, POST /accounts`);
      console.log(`✓ Transfer API: POST /transfer`);
      console.log(`✓ Logs API: GET /logs`);
    });

    // graceful shutdown on SIGTERM (important for cloud platforms like Render)
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        disconnectDB();
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    await disconnectDB();
    process.exit(1);
  }
}

main();
