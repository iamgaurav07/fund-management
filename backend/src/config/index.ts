import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is missing`);
  }

  return value;
};

export const PORT = parseInt(getEnv('PORT', process.env.PORT));
export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const LOG_LEVEL = getEnv('LOG_LEVEL', 'info');
export const MONGO_URI = getEnv('MONGO_URI', process.env.MONGO_URI);
