import {
	default as express,
	NextFunction,
	Request,
	Response
} from 'express';
import {
	default as mongoose,
} from 'mongoose';


import {
	ILike,
	IAgree,
	INotification,
	NotificationType,
	UserModel
} from '../../models/mongoose';

class DBOperations {
	static sanitizeParameters(parameters: any, prefix: string = ''): any {
		const paramKeys: string[] = Object.keys(parameters).filter((param: string) => ! ['pageNr', 'limit'].includes(param));
		const sanitizedParams: any = {};

		paramKeys.forEach((paramKey: string) => {
			if (parameters[paramKey] && parameters[paramKey].includes('[') && Array.isArray(JSON.parse(parameters[paramKey]))) {
				const sanitizedArray = JSON.parse(parameters[paramKey]).map((str: string) => str.trim());
				sanitizedParams[`${prefix}${paramKey}`] = sanitizedArray;
			} else if (parameters[paramKey]) {
				sanitizedParams[`${prefix}${paramKey}`] = parameters[paramKey].trim();
			}
		});

		return sanitizedParams;
	}

	static createFilter(parameters: any, includeSoftDeleted: boolean = false) {
		const paramKeys: string[] = Object.keys(parameters);

		const filter: any = (includeSoftDeleted) ? {} : {
			softDeleted: false
		};

		paramKeys.forEach((paramKey: string) => {
			if (Array.isArray(parameters[paramKey]))  {
				const value = {$in: parameters[paramKey]};
				filter[paramKey] = value;
			} else if (paramKey.slice(-5) === ':like') {
				const key = paramKey.slice(0, paramKey.length - 5);
				const value = new RegExp(parameters[paramKey], "i") ;
				filter[key] = value;
			} else {
				filter[paramKey] = parameters[paramKey]
			}
			// const value = (Array.isArray(parameters[paramKey])) 
			// 	? {
			// 		$in: parameters[paramKey]
			// 	} : parameters[paramKey];
		});
		return filter;
	}

	static softDeleteById(
		model: mongoose.Model < any > ,
		id: string,
		userId: string = undefined
	): Promise < any > {
		const query: any = {
			_id: mongoose.Types.ObjectId(id)
		};
		if (userId) query.user = userId;
		return new Promise < any > ((res, rej) => {
			model.updateOne(
					query, {
						$set: {
							[`softDeleted`]: true
						}
					})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static undeleteById(
		model: mongoose.Model < any > ,
		id: string,
		userId: string = undefined
	): Promise < any > {
		const query: any = {
			_id: mongoose.Types.ObjectId(id)
		};
		if (userId) query.user = userId;
		return new Promise < any > ((res, rej) => {
			model.updateOne(
					query, {
						$set: {
							[`softDeleted`]: false
						}
					})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static permanentDelete(
		model: any,
	): Promise < any > {
		return new Promise < any > ((res, rej) => {
			model.deleteMany({
					softDeleted: true
				})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static setLike(
		model: mongoose.Model < any > ,
		postId: string,
		userId: string,
	): Promise < any > {
		const query: object = {
			_id: mongoose.Types.ObjectId(postId)
		};
		const likeDoc: ILike = {
			user: mongoose.Types.ObjectId(userId),
			_createdAt: Date.now(),
		};
		return new Promise < any > ((res, rej) => {
			model.updateOne(
					query, {
						$push: {
							likes: likeDoc
						}
					})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static deleteLike(
		model: mongoose.Model < any > ,
		postId: string,
		userId: string,
	): Promise < any > {
		const query: object = {
			_id: mongoose.Types.ObjectId(postId)
		};

		return new Promise < any > ((res, rej) => {
			model.updateOne(
					query, {
						$pull: {
							likes: {
								user: userId
							}
						}
					})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static setAgree(
		model: mongoose.Model < any > ,
		feedbackId: string,
		userId: string,
	): Promise < any > {
		const query: object = {
			'feedback._id': mongoose.Types.ObjectId(feedbackId)
		};
		const agreeDoc: IAgree = {
			user: mongoose.Types.ObjectId(userId),
			_createdAt: Date.now(),
		};
		return new Promise < any > ((res, rej) => {
			model.updateOne(
					query, {
						$push: {
							'feedback.$.agrees': agreeDoc,
						}
					})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static deleteAgree(
		model: mongoose.Model < any > ,
		feedbackId: string,
		userId: string,
	): Promise < any > {
		const query: object = {
			'feedback._id': mongoose.Types.ObjectId(feedbackId)
		};

		return new Promise < any > ((res, rej) => {
			model.updateOne(
					query, {
						$pull: {
							'feedback.$.agrees': {
								user: mongoose.Types.ObjectId(userId)
							}
						}
					})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static sendNotificiationToAll(content: string, destinationUrl: string, senderUser:string = '', type: NotificationType): Promise < any > {
		const query = {
			role: 'user'
		};
		const notification: INotification = {
			content,
			destinationUrl,
			type,
			senderUser: mongoose.Types.ObjectId(senderUser),
			_createdAt: Date.now(),
		}
		return new Promise < any > ((res, rej) => {
			UserModel.updateMany(
					query, {
						$push: {
							notifications: notification
						}
					})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static sendNotificationToUser(userId: string, content: string, destinationUrl: string = '', senderUser:string = '', type: NotificationType): Promise < any > {
		const query = {
			'_id': mongoose.Types.ObjectId(userId)
		};
		const notification: INotification = {
			content,
			destinationUrl,
			type,
			senderUser: (senderUser) ? mongoose.Types.ObjectId(senderUser) : undefined,
			_createdAt: Date.now(),
		}
		return new Promise < any > ((res, rej) => {
			UserModel.updateOne(
					query, {
						$push: {
							notifications: notification
						}
					})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static async getWithIds(model: any, idKey: string, ids: string[], formatToIds: boolean = false): Promise<any[]> {
		let results: any[] = [];
		// return new Promise((resolve, reject) => {
		// 	ids.forEach(async (id, index) => {
		// 		const collection: any[] = await model.find({[idKey]: id })
		// 			.exec()
		// 			.catch((err: any)=> reject(err));
		// 		results.push(...collection);

		// 		if (index === ids.length - 1) {
		// 			if (formatToIds) results = results.map((result) => result._id);
		// 			resolve(results);
		// 		}
		// 	});
		// });		
		for(let i = 0; i < ids.length; i++) {
			const collection: any[] = await model.find({[idKey]: ids[i] })
					.exec()
				results.push(...collection);
		}
		if (formatToIds) results = results.map((result) => result._id);
		return results;
	}

	static async getPostsWithIds(model: any, idKey: string, ids: string[]): Promise<any[]> {
		let results: any[] = [];

			for(let i = 0; i < ids.length; i++) {
				const collection: any[] = await model.find({'assignment': ids[i] })
					.populate({
						path: 'assignment',
						populate: {
							path: 'courseId',
						}
					})
					.populate('pictures')
					.populate('user', 'profile.username profile.profilePictureName _id')
					.sort([['_createdAt', 'desc']])
					.exec()
					results.unshift(...collection);
			}
			return results;
	}

	static paginate(docs: any[], limit: number, pageNr: number): any[] {
		if (docs.length <= limit) {
			return docs;
		}
		return docs.slice(pageNr * limit, (pageNr * limit) + limit);
	}
}

export default DBOperations;