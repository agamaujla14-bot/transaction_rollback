import { mongoose } from '../config/db.js';
import Account from '../models/Account.js';
import TransactionLog from '../models/TransactionLog.js';
import { ApiError } from '../utils/errors.js';

/**
 * Transfer funds between two accounts inside a MongoDB transaction.
 * Rolls back on any failure or insufficient balance.
 *
 * @param {String} fromId - ObjectId string of sender account
 * @param {String} toId - ObjectId string of receiver account
 * @param {Number} amount - Positive number to transfer
 * @returns {Promise<Object>} transaction log document
 */
export async function transferFunds(fromId, toId, amount) {
    if (amount <= 0) {
        throw new ApiError('Amount must be greater than zero', 400);
    }

    const session = await mongoose.startSession();
    let logEntry;

    try {
        await session.withTransaction(async () => {
            // Fetch accounts inside the transaction session to ensure they are part
            // of the transaction and see the most up-to-date balances.
            const opts = { session, new: false };

            const fromAcc = await Account.findById(fromId, null, opts);
            const toAcc = await Account.findById(toId, null, opts);

            if (!fromAcc || !toAcc) {
                throw new ApiError('One or both accounts not found', 404);
            }

            if (fromAcc.balance < amount) {
                throw new ApiError('Insufficient funds', 400);
            }

            // subtract and add
            fromAcc.balance -= amount;
            toAcc.balance += amount;

            // write updates
            await fromAcc.save(opts);
            await toAcc.save(opts);

            // create a successful transaction log
            logEntry = await TransactionLog.create([
                {
                    from: fromAcc._id,
                    to: toAcc._id,
                    amount,
                    status: 'SUCCESS',
                },
            ], { session });
        });
    } catch (err) {
        // transaction aborted automatically on error; log the failure separately
        try {
            const failedLog = new TransactionLog({
                from: fromId,
                to: toId,
                amount,
                status: 'FAILED',
                error: err.message,
            });
            await failedLog.save();
        } catch (logErr) {
            console.error('Failed to write failure log:', logErr);
        }

        // rethrow for caller to handle
        throw err;
    } finally {
        session.endSession();
    }

    return logEntry && logEntry[0];
}
