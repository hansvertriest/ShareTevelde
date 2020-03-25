import { default as App } from './app';

import { default as Config, IConfig, Environment } from './app/services/config';
import Logger, { ILogger } from './app/services/logger';
import { MongoDBDatabase, GridFs } from './app/services/database';

(async () => {
  // Create a Config service
  const config: IConfig = new Config();

  // Create a Logger service
  const logger: ILogger = new Logger();

  try {
    // Create a Database service
    const mongoDBDatabase = new MongoDBDatabase(logger, config);
    const connected = await mongoDBDatabase.connect();

    if (config.env === Environment.development) {
      // mongoDBDatabase.seed();
    }

    // init gridFs stream
    GridFs.initStream();

    // Create the Express application
    const app: App = new App(logger, config);
    app.start();

    // Stop all running processes
    const stopAllProcesses = async () => {
      app.stop();
      await mongoDBDatabase.disconnect();

      logger.info('Stopped all processes for this application', {});
    };

    process.on('SIGINT', () => stopAllProcesses());
    process.on('SIGTERM', () => stopAllProcesses());
  } catch (error) {
    logger.error("Can't launch the application", error);
  }
})(); // IIFE
