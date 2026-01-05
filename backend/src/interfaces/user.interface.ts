// interfaces/user.interface.ts
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// For responses (excludes password)
export interface UserResponse {
  _id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
}

// For lean queries
export interface IUserLean {
  _id: Types.ObjectId;
  email: string;
  password?: string;
  isVerified: boolean;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  createdAt: Date;
  updatedAt: Date;
}
