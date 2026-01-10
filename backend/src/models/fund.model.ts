import { IFund } from '@/interfaces/fund.interface';
import { Schema, model } from 'mongoose';

const fundSchema = new Schema<IFund>(
  {
    fundName: { type: String, required: true },
    description: { type: String },
    fundSize: { type: Number, required: true },
    vintageYear: { type: Number, required: true },
    managementFee: { type: Number, required: true },
    carry: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'], required: true },
    status: { type: Number, enum: [0,1,2,3], required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

const Fund = model<IFund>('Fund', fundSchema);

export default Fund;
