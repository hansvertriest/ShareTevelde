import express, { Request, Response, NextFunction } from 'express';
import { GridFs } from '../../services/database';

class PictureController {
  constructor() {}

  public show = (req: Request, res: Response, next: NextFunction): void => {
    GridFs.pipeImage(req, res);
  }

  public upload = (req: Request, res: Response, next: NextFunction): void => {
    if (req.file) {
      res.status(200).json({'filename': req.file.filename})
    } else {
      res.status(412).json({'error': 'No files were received'});
    }
  }
}

export default PictureController;
