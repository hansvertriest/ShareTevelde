import mongoose, {
	Connection
} from 'mongoose';
import {
	Request,
	Response,
	NextFunction
} from 'express'
import GridFsStorage from 'multer-gridfs-storage';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import {
	default as sharp
} from 'sharp';

import Logger, {
	ILogger
} from '../../services/logger';
import {
	default as stream
} from 'stream';

interface IMulter {
	storage: multer.StorageEngine,
}

class GridFs {
	private connection: Connection;
	private logger: ILogger;
	private gfsBucket: any;
	private defaultBucketName: string = 'uploads';
	private bucketName: string;


	constructor() {
		this.logger = new Logger();
	}

	public initStream(bucketName ? : string): void {
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
		Resizes picture and uploads it to mongoDB
	*/

	public resizeAndUploadImage = async (req: Request, res: Response, next: NextFunction): Promise < Response < any >> => {
		const input = req.file;
		const dimensionX = (req.body.width && parseInt(req.body.width) <= 500) ? parseInt(req.body.width) : 200;
		const dimensionY = (req.body.height && parseInt(req.body.height) <= 500) ? parseInt(req.body.height) : 200;
		try {
			if (dimensionX !== dimensionY) throw {code: 412, msg: 'Given dimensions must be square.'}
			crypto.randomBytes(16, async (err, buf) => {
				await sharp(input.buffer)
					.resize(dimensionX, dimensionY, {
						fit: 'cover'
					})
					.toFormat("jpeg")
					.jpeg({
						quality: 90
					})
					.toBuffer((err: any, data: any, info: any) => {
						const fileName = buf.toString('hex') + path.extname(input.originalname);
						const bufferStream = new stream.PassThrough();
						bufferStream.end(data);
						bufferStream.pipe(
							this.gfsBucket.openUploadStream(fileName)
							.on('error', (error: any) => {
								this.logger.error('Error while uploading file', error);
								throw {
									code: 500,
									error: 'Something went wrong while converting your picture.'
								};
							})
							.on('finish', () => {
								req.file.filename = fileName;
								next();
							})
						)
					});
			})
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while converting a picture.', error);
			return res.status(500).send({
				code: 500,
				msg: 'Unknown error occured.'
			});
		}
	}

	/*
		Resizes picture and uploads it to mongoDB
	*/

	public resizeAndUploadPostPic = async (req: Request, res: Response, next: NextFunction): Promise < Response < any >> => {
		const input = req.file;
		try {
			crypto.randomBytes(16, async (err, buf) => {
				await sharp(input.buffer)
					.resize(500, 500, {
						fit: 'cover',
					})
					.toFormat("jpeg")
					.jpeg({
						quality: 90
					})
					.toBuffer((err: any, data: any, info: any) => {
						const fileName = buf.toString('hex') + path.extname(input.originalname);
						const bufferStream = new stream.PassThrough();
						bufferStream.end(data);
						bufferStream.pipe(
							this.gfsBucket.openUploadStream(fileName)
							.on('error', (error: any) => {
								this.logger.error('Error while uploading file', error);
								throw {
									code: 500,
									error: 'Something went wrong while converting your picture.'
								};
							})
							.on('finish', () => {
								req.file.filename = fileName;
								next();
							})
						)
					});
			})
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while converting a picture.', error);
			return res.status(500).send({
				code: 500,
				msg: 'Unknown error occured.'
			});
		}
	}

	/*
		Creates a gridFs storage object
		Deprecated: replaced with resizenAndUploadProfilePic and resizenAndUploadPostPic
	*/

	public createStorage(): any {
		const storage = new GridFsStorage({
			url: process.env.MONGODB_CONNECTION,
			file: (req: any, file: any) => {
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
		return multer({
			storage
		});
	}

	/*
		Pipes the requested image into the response
		FIX: typing
	*/

	public pipeImage(req: Request, res: Response): void {
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