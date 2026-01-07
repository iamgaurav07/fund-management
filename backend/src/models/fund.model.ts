import { IFund } from '@/interfaces/fund.interface';
import { Schema, model } from 'mongoose';

const fundSchema = new Schema<IFund>(
  {
    fundName: { type: String, required: true },
    description: { type: String },
    fundSize: { type: Number, required: true },
    vintageYear: { type: Number, required: true },
    managementFee: { type: Number, required: true },
    carryFee: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'EUR', 'GBP'], required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

const Fund = model<IFund>('Fund', fundSchema);

export default Fund;
