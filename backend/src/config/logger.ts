import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LOG_LEVEL, NODE_ENV } from '.';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const transports: winston.transport[] = [
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
  }),
];

if (NODE_ENV !== 'PRODUCTION') {
  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    })
  );
}

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports,
});

export default logger;