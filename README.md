# Experiment 2.2.3 — Banking Transaction System with Rollback

This project is the submitted implementation for the FS experiment in `experiment-6.2`:
- ACID-compliant banking transfer
- MongoDB transactions with Mongoose
- Rollback on failure + transaction audit logs

## Objective

Build a system that:
1. Transfers funds from one account to another inside a MongoDB transaction.
2. Rejects transfers when sender balance is insufficient.
3. Rolls back all database changes (sender/receiver updates) on any error.
4. Records every attempt in a transaction log (`SUCCESS` or `FAILED`).

## Setup (in the experiment-6.2 folder)

```sh
cd "c:\\Users\\Agam Aujla\\AGAM FS\\experiment-6.2"
npm install
cp .env,example .env (or manually create .env)
```

`.env` should contain:

```env
MONGODB_URI=mongodb://localhost:27017/transaction_demo
```

## Start the app

```sh
npm start
# or for dev:
npm run dev
```

## API Endpoints

- GET `/health` — check server is alive.
- GET `/accounts` — get list of accounts.
- POST `/accounts` — create account: `{ "name": "Alice", "balance": 1000 }`.
- POST `/transfer` — transfer money: `{ "fromId": "...", "toId": "...", "amount": 200 }`.
- GET `/logs` — audit history of all transfers.

## Transaction behavior

`transferFunds()` in `src/services/transactionService.js`:
- Starts `mongoose.startSession()`.
- `.withTransaction(...)` executes:
  - load accounts using session
  - validate existence and funds
  - decrement sender and increment receiver
  - save both inside session
  - create `TransactionLog` with `status: SUCCESS`
- on any exception:
  - MongoDB aborts the transaction (rollback)
  - separate failure `TransactionLog` entry with `status: FAILED` + `error` message

## Project structure

- `src/config/db.js` — MongoDB connection + mongoose export
- `src/models/Account.js` — account schema
- `src/models/TransactionLog.js` — audit schema
- `src/services/transactionService.js` — core transfer + rollback implementation
- `src/controllers/*` + `src/routes/*` — Express endpoint wiring
- `index.js` — app entrypoint

## Experiment evaluation points covered

- Atomicity: transfer either fully applies or none.
- Consistency: balance non-negative, all checks before commits.
- Isolation: transaction session ensures isolated view.
- Durability: writes are committed to MongoDB.
- Rollback tests: insufficient funds or invalid IDs produce rollback and failed log.
- Logging: all transfer attempts recorded for audit.

## Quick test commands

1. Create accounts
```sh
curl -X POST http://localhost:3000/accounts -H "Content-Type: application/json" -d '{"name":"Alice","balance":1000}'
curl -X POST http://localhost:3000/accounts -H "Content-Type: application/json" -d '{"name":"Bob","balance":500}'
```
2. Transfer
```sh
curl -X POST http://localhost:3000/transfer -H "Content-Type: application/json" -d '{"fromId":"<aliceId>","toId":"<bobId>","amount":200}'
```
3. Insufficient funds
```sh
curl -X POST http://localhost:3000/transfer -H "Content-Type: application/json" -d '{"fromId":"<aliceId>","toId":"<bobId>","amount":99999}'
```
4. Read logs
```sh
curl http://localhost:3000/logs
```

---

## Viva prep answers

1. ACID = Atomicity, Consistency, Isolation, Durability.
2. Sessions provide the transaction context and guarantee multiple operations are grouped into a commit/abort unit.
3. Conflicts handled by transaction retry (`withTransaction`) and optimistic concurrency on model; if permanent failure, abort and return error.
4. Rollback is DB-level undo; compensation is application-level reversal (used when irreversible operations exist).
5. Two-phase commit for distributed transactions across multiple independent systems where no single DB can span all resources.

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
