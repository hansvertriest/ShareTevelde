import { default as express, NextFunction, Request, Response } from 'express';
import util from 'util';

import Logger, { ILogger } from '../services/logger';
import { PictureModel, IPicture } from '../models/mongoose';
import { GridFs } from '../services/database';

class UploadController {
  private logger: ILogger;

  constructor() {
    this.logger = new Logger();
  }

  public index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response<any> | void {
    res.render('pages/upload', {});
  }

  public async upload(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // upload the details
    const picture: IPicture = new PictureModel({
      title: req.body.pictureTitle,
      description: req.body.pictureDescription,
      pictureFileName: req.file.filename,
    });

    picture
      .save()
      .then(docs => {
        res.redirect(`/api/pictures/${req.file.filename}`);
      })
      .catch(err => {
        this.logger.error('PictureDetails could not be saved', err);
      });
  }
}

export default UploadController;
