import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Simple account schema with balance and some metadata
const accountSchema = new Schema(
  {
    name: { type: String, required: true },
    balance: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// enable optimistic concurrency (versionKey) if needed for concurrent writes
accountSchema.set('optimisticConcurrency', true);

export default model('Account', accountSchema);
