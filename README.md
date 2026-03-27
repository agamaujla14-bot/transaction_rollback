# Transaction Rollback Demo

A simple banking transaction system built with Node.js, Mongoose and MongoDB that
illustrates ACID-compliant transactions and rollback behaviour.

## Features

- **Atomic transfers**: money is moved only when whole operation succeeds
- **Consistency checks**: balance must be sufficient before transfer
- **Isolation & concurrency**: operations run inside MongoDB sessions
- **Durability**: data persisted by MongoDB
- **Automatic rollback** on failure
- **Transaction logs** for auditing

## Requirements

- Node.js 18 or higher
- MongoDB 4.0+ (must support transactions, i.e. replica set or localhost with --replSet)

## Setup

1. Clone the repo and change directory:
   ```sh
   git clone <repo-url> && cd transaction_rollback
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the project root with the MongoDB URI, e.g:
   ```sh
   MONGODB_URI=mongodb://localhost:27017/transaction_demo
   ```

4. Ensure your MongoDB instance is running as a replica set (transactions require it):
   ```sh
   mongod --dbpath=./data --replSet rs0
   mongo --eval "rs.initiate()"
   ```

## Running

The project now exposes HTTP APIs for account management and transfers. To start the server:

```sh
npm start       # runs index.js which connects to MongoDB, seeds demo accounts, and launches Express
npm run dev     # start with nodemon for development
```

Once running, you can interact with the service:

- **GET `/health`** – simple health check
- **GET `/accounts`** – list all accounts
- **POST `/accounts`** – create account (JSON body `{ name, balance }`)
- **POST `/transfer`** – perform a transfer (JSON body `{ fromId, toId, amount }`)
- **GET `/logs`** – retrieve audit log entries

For example:

```sh
curl -X POST http://localhost:3000/transfer \
  -H 'Content-Type: application/json' \
  -d '{"fromId":"<id>","toId":"<id>","amount":100}'
```

The service will respond with the transaction log entry; failures return a
`400` or `500` with an error message.

## Code Structure

- `src/config/db.js` – centralized MongoDB connection management
- `src/models/Account.js` – Mongoose schema for accounts
- `src/models/TransactionLog.js` – schema for audit logs
- `src/services/transactionService.js` – core transfer logic using sessions and the shared mongoose instance
- `src/controllers/` – request handlers that validate input and call services (accounts, transfers, logs)
- `src/routes/` – Express route definitions that wire controllers to endpoints
- `index.js` – server startup script (root-level entry point) that seeds data and launches Express

## Viva Questions

1. **What does ACID stand for in databases?**
   - Atomicity, Consistency, Isolation, Durability.

2. **Why are MongoDB sessions used in transactions?**
   - Sessions allow grouping operations together so they can be committed or
     aborted as a unit; they provide the context for a multi-document
     transaction.

3. **How do you handle transaction conflicts?**
   - Retry logic on transient errors like `WriteConflict`; use optimistic
     concurrency or use `session.withTransaction` which automatically retries
     some errors.

4. **What is the difference between rollback and compensation?**
   - Rollback undoes changes automatically by the database; compensation is a
     manual reversal performed at an application level when raw rollback is not
     possible.

5. **When should two-phase commit be used?**
   - When coordinating a transaction across multiple distinct resource managers
     (e.g., two different databases) where a single transactional context
     cannot span both.

## Extending

- Add more detailed logging/analytics
- Implement concurrency tests and retry strategies
- Expose additional account operations (e.g. deposit/withdraw) or integrate authentication

---

This project uses ES modules (`"type": "module"` in package.json) as requested.
