import express, { Application, NextFunction, Request, Response } from 'express';

import {
  FallbackController,
  HomeController,
  UploadController,
} from '../controllers';
import { default as ApiRouter } from '../api/router';
import Logger, { ILogger } from '../services/logger';
import { GridFs } from '../services/database';

class Router {
  private app: Application;
  private apiRouter: ApiRouter;
  private homeController: HomeController;
  private fallbackController: FallbackController;
  private uploadController: UploadController;
  private logger: ILogger;

  constructor(app: Application) {
    this.app = app;
    this.apiRouter = new ApiRouter();

    this.logger = new Logger();

    this.registerControllers();
    this.registerRoutes();
  }

  private registerControllers() {
    this.fallbackController = new FallbackController();
    this.homeController = new HomeController();
    this.uploadController = new UploadController();
  }

  private registerRoutes() {
    // this.app.route(['/', '/home']).all(this.homeController.index);
    this.app.use('/api', this.apiRouter.router);
    // this.app.use('/*', this.fallbackController.index);
    try {
      this.app.get('/upload', this.uploadController.index);
      this.app.post(
        '/upload',
        GridFs.createStorage().single('picture'),
        this.uploadController.upload,
      );
    } catch (error) {
      this.logger.error('Error at registering routes', error);
    }
  }
}

export default Router;
