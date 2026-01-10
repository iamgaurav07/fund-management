import { IFund } from '@/interfaces/fund.interface';
import { Schema, model } from 'mongoose';

const fundSchema = new Schema<IFund>(
  {
    name: { type: String, required: true },
    description: { type: String },
    fundSize: { type: Number, required: true },
    vintageYear: { type: Number, required: true },
    managementFeePercent: { type: Number, required: true },
    carryPercent: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'], required: true },
    status: { type: String, enum: ['DRAFT', 'OPEN', 'CLOSED', 'LIQUIDATED'], required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

const Fund = model<IFund>('Fund', fundSchema);

export default Fund;
