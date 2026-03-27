import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const transactionLogSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
    error: { type: String },
  },
  { timestamps: true }
);

export default model('TransactionLog', transactionLogSchema);
