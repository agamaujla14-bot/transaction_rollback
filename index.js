import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import Account from './src/models/Account.js';
import { connectDB, disconnectDB } from './src/config/db.js';

async function main() {
  await connectDB();

  // start HTTP server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error('Unhandled error', err);
  disconnectDB();
  process.exit(1);
});
