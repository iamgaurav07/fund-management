import dotenv from 'dotenv';

dotenv.config();

export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
export const FROM_EMAIL = process.env.FROM_EMAIL;
export const FROM_NAME = process.env.FROM_NAME || 'PASCHA PIZZERIA & KEBAP HAUS';
export const NODE_ENV = process.env.NODE_ENV ||  'EDGE'

if (!SENDGRID_API_KEY) {
  throw new Error('SendGrid API key is missing in environment variables');
}