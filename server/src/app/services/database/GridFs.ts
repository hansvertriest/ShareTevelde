import mongoose, { Connection } from 'mongoose';
import { Request, Response } from 'express'
import GridFsStorage from 'multer-gridfs-storage';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

import Logger, { ILogger } from '../../services/logger';
import MulterGridfsStorage from 'multer-gridfs-storage';

class GridFs {
  private connection: Connection;
  private logger: ILogger;
  private gfsBucket: any;
  private defaultBucketName: string = 'uploads';
  private bucketName: string;

  constructor() {
    this.logger = new Logger();
  }

  public initStream(bucketName?: string): void {
    this.bucketName = bucketName ? bucketName : this.defaultBucketName;
    if (mongoose.connection.readyState === 1) {
      // init stream
      this.gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: this.bucketName,
      });
      this.logger.info('Initiated GridFs stream', {});
    } else {
      this.logger.error('Could not initiated GridFs stream because there is no connection', {});
    }
  }

  /*
		Creates a gridFs storage object
		FIX: return type
	*/

  public createStorage(): any {
    const storage = new GridFsStorage({
      url: process.env.MONGODB_CONNECTION,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename =
              buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: this.bucketName,
            };
            resolve(fileInfo);
          });
        });
      },
    });
    return multer({ storage });
  }

  /*
		Pipes the requested image into the response
		FIX: typing
	*/

  public pipeImage( req: Request, res: Response) : void {
    const file = this.gfsBucket
      .find({
        filename: req.params.filename,
      })
      .toArray((err: any, files: any) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: '404: file does not exist',
          });
        }
        this.gfsBucket
          .openDownloadStreamByName(req.params.filename)
          .pipe(res);
      });
    }
}

export default new GridFs();
