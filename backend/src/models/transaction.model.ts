import { ITransaction } from '@/interfaces/transaction.interface';
import { Schema, model } from 'mongoose';

const transactionSchema = new Schema<ITransaction>(
  {
    fundId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Fund', 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['CAPITAL_CALL', 'INVESTMENT', 'DISTRIBUTION'], 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true,
      min: 0
    },
    date: { 
      type: Date, 
      required: true 
    },
    currency: { 
      type: String, 
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'], 
      required: true 
    },
    description: { 
      type: String 
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
transactionSchema.index({ fundId: 1, date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ date: 1 });

// Virtual populate to get fund name
transactionSchema.virtual('fund', {
  ref: 'Fund',
  localField: 'fundId',
  foreignField: '_id',
  justOne: true
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;