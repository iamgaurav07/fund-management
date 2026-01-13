import { IInvestment } from '@/interfaces/investment.interface';
import { Schema, model } from 'mongoose';

const investmentSchema = new Schema<IInvestment>(
  {
    fundId: {
      type: Schema.Types.ObjectId,
      ref: 'Fund',
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    investedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currentValue: {
      type: Number,
      required: true,
      min: 0,
    },

    investmentDate: {
      type: Date,
      required: true,
    },

    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
      required: true,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'EXITED', 'WRITTEN_OFF'],
      default: 'ACTIVE',
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
investmentSchema.index({ fundId: 1 });
investmentSchema.index({ companyName: 1 });
investmentSchema.index({ status: 1 });
investmentSchema.index({ investmentDate: -1 });

// Virtual populate to get fund details
investmentSchema.virtual('fund', {
  ref: 'Fund',
  localField: 'fundId',
  foreignField: '_id',
  justOne: true,
});

const Investment = model<IInvestment>('Investment', investmentSchema);

export default Investment;