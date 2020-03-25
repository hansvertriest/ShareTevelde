import { default as http, createServer, Server } from 'http';
import {
  default as express,
  Application,
  NextFunction,
  Request,
  Response,
} from 'express';

import { default as Router } from './router';
import {
  GlobalMiddleware,
  MorganMiddleware,
  SwaggerMiddleware,
} from './middleware';
import { IAppError } from './utilities';
import { IConfig, Environment } from './services/config';
import { ILogger } from './services/logger';

class App {
  public app: Application;
  private config: IConfig;
  private logger: ILogger;
  private router: Router;
  private server: Server;

  constructor(logger: ILogger, config: IConfig) {
    this.logger = logger;
    this.config = config;

    this.createExpress();
    this.createServer();
  }

  private createExpress(): void {
    this.app = express();
    GlobalMiddleware.load(this.app, __dirname);
    if (this.config.env === Environment.development) {
      MorganMiddleware.load(this.app);
    }
    SwaggerMiddleware.load(this.app, __dirname);
    this.createRouter();
    this.app.use(this.clientErrorHandler);
    this.app.use(this.errorHandler);
  }

  private clientErrorHandler(
    error: IAppError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (req.xhr) {
      res.status(error.status).json({ error });
    }
    next(error);
  }

  private errorHandler(
    error: IAppError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (error.status === 404) {
      res.status(404).render('pages/404');
    } else {
      res.status(error.status).render('pages/404');
    }
  }

  private createServer(): void {
    this.server = createServer(this.app);
    this.server.on('error', (error?: Error) => {
      this.gracefulShutdown(error);
    });
    this.server.on('close', () => {
      this.logger.info('Server is closed!', {});
    });
    this.server.on('listening', () => {
      this.logger.info(
        `Server is listening on ${this.config.server.host}:${this.config.server.port}`,
        {},
      );
    });
  }

  private createRouter(): void {
    this.router = new Router(this.app);
  }

  public start(): void {
    this.server.listen(this.config.server.port, this.config.server.host);
  }

  public stop(): void {
    this.server.close((error?: Error) => {
      this.gracefulShutdown(error);
    });
  }

  private gracefulShutdown(error?: Error): void {
    this.logger.info('Server is gracefully shutdown!', error || {});

    if (error) {
      process.exit(1);
    }
    process.exit();
  }
}

export default App;
