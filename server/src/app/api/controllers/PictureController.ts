import express, { Request, Response, NextFunction } from 'express';
import { GridFs } from '../../services/database';

class PictureController {
  constructor() {}

  public show(req: Request, res: Response, next: NextFunction): void {
    GridFs.pipeImage(res, req);
  }
}

export default PictureController;
