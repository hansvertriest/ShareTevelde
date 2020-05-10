import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { NotificationType, UserModel } from '../../models/mongoose';
import {DBOperations} from '../../services/database';


class NotificationController {
	private logger: Logger;

	constructor() {
		this.logger = new Logger();
	}

	public sendAll = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try{
			// get body 
			const { content, destinationUrl, type, token } = req.body;
			if (!content || !destinationUrl || !type) throw {code: 412, msg: 'Requireed parameters missing.'}

			// send notification
			DBOperations.sendNotificiationToAll(content, destinationUrl, token.id, type)
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

	public send = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try{
			// get body 
			const { userId, content, destinationUrl, type, token } = req.body;
			if (!content || !destinationUrl || !type) throw {code: 412, msg: 'Required parameters missing.'}
			if (!Object.values(NotificationType).includes(type)) throw {code: 412, msg: 'Type is not valid.'}
			// send notification
			DBOperations.sendNotificationToUser(userId, content, destinationUrl, token.id, type)
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
			const limit = (req.query.limit) ? parseInt(req.query.limit) : undefined;
			const pageNr = (req.query.limit) ? parseInt(req.query.pageNr) : undefined;

			//get notifications
			let userNotification = await UserModel.findOne({_id: mongoose.Types.ObjectId(token.id)})
				.select('notifications')
				.populate('notifications.senderUser', 'profile.profilePictureName')
				.exec()

			// paginate
			let notifications = (userNotification) ? userNotification.notifications : null;
			if ( limit !== undefined && pageNr !== undefined){
				notifications = DBOperations.paginate(userNotification.notifications, limit, pageNr);
			}

			// check output and send response
			if (notifications) {
				return res.status(200).send(notifications);
			} else {
				throw {code: 404, msg: 'No notifications for given user', id: token.id}
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while soft deleting course.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}
}

export default NotificationController;