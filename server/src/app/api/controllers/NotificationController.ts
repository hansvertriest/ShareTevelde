import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { CourseModel, ICourse, CourseModelKeys, UserModel } from '../../models/mongoose';
import {DBOperations} from '../../services/database';


class NotificationController {
	private logger: Logger;

	constructor() {
		this.logger = new Logger();
	}

	public sendAll = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try{
			// get body 
			const { content, destinationUrl } = req.body;

			// send notification
			DBOperations.sendNotificiationToAll(content, destinationUrl)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No courses were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted.'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					if (err.msg) return res.status(err.code).send(err)
				});
		} catch(error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while soft deleting course.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public get = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			// get body
			const { token } = req.body;

			//get notifications
			const notifications = await UserModel.findOne({_id: mongoose.Types.ObjectId(token.id)})
				.select('notifications')

			// check output and send response
			if (notifications) {
				return res.status(200).send(notifications);
			} else {
				throw {code: 404, msg: 'No notifications for given user'}
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while soft deleting course.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}
}

export default NotificationController;