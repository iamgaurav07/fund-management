import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import 'reflect-metadata';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';
import healthRouter from './routes/health.route';
import { connectDB } from './config/database';
import routes from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializeDatabase() {
    await connectDB();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());

    // Configure CORS based on environment
    const corsOptions = {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) => {
        if (!origin) return callback(null, true);

        if (process.env.NODE_ENV === 'PRODUCTION') {
          const allowedDomains = [
            'https://meiningen-paschapizzeria.de',
            'https://www.meiningen-paschapizzeria.de',
            'https://imbiss-bollywood.de',
            'https://www.imbiss-bollywood.de',
          ];

          if (allowedDomains.includes(origin)) {
            return callback(null, true);
          } else {
            return callback(new Error('Not allowed by CORS'));
          }
        } else {
          // Allow all origins in development
          return callback(null, true);
        }
      },
      credentials: true, // Allow cookies and authentication headers
      optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.use('/healthz', healthRouter);
    this.app.use('/v1', routes);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }
}

export default new App().app;
