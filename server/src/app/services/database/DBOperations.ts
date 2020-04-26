import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection, Model } from 'mongoose';


import { ILike, IAgree, INotification, UserModel } from '../../models/mongoose';

class DBOperations {
	static sanitizeParameters (parameters: any, prefix: string = ''): any {
		const paramKeys: string[] = Object.keys(parameters);
		const sanitizedParams: any = {};
		
		paramKeys.forEach((paramKey: string) => {
			if (parameters[paramKey] && parameters[paramKey].includes('[') && Array.isArray(JSON.parse(parameters[paramKey]))) {
				const sanitizedArray = JSON.parse(parameters[paramKey]).map((str: string) => str.trim());
				sanitizedParams[`${prefix}${paramKey}`] = sanitizedArray;
			} else if (parameters[paramKey]) {
				console.log(parameters[paramKey]);
				sanitizedParams[`${prefix}${paramKey}`] = parameters[paramKey].trim();
			}
		});

		return sanitizedParams;
	}

	static createFilter (parameters: any, includeSoftDeleted: boolean = false) {
		const paramKeys: string[] = Object.keys(parameters);

		const filter: any = (includeSoftDeleted) ? {} : {softDeleted: false};
		paramKeys.forEach((paramKey:string) => {
			const value = (Array.isArray(parameters[paramKey])) ? {$in: parameters[paramKey]} : parameters[paramKey]; 
			filter[paramKey]  =  value;
		});
		return filter;
	}

	static softDeleteById (
		model: mongoose.Model<any>,
		id: string,
		userId: string = undefined
	): Promise<any> {
		const query: any = { _id: mongoose.Types.ObjectId(id)};
		if (userId) query.user = userId;
		return new Promise<any>((res, rej) => {
			model.updateOne(
				query,
				{
					$set : {[`softDeleted`] : true}
				})
			.then((resolve: any) => {
				res(resolve);
			}).catch((err: any) => {
				rej(err);
			});
		});
	}

	static undeleteById (
		model: mongoose.Model<any>,
		id: string,
		userId: string = undefined
	): Promise<any> {
		const query: any = { _id: mongoose.Types.ObjectId(id)};
		if (userId) query.user = userId;
		return new Promise<any>((res, rej) => {
			model.updateOne(
				query,
				{
					$set : {[`softDeleted`] : false}
				})
			.then((resolve: any) => {
				res(resolve);
			}).catch((err: any) => {
				rej(err);
			});
		});
	}

	static permanentDelete (
		model: any,
	): Promise<any> {
		return new Promise<any>((res, rej) => {
			model.deleteMany({softDeleted: true})
				.then((resolve: any) => {
					res(resolve);
				}).catch((err: any) => {
					rej(err);
				});
		});
	}

	static setLike (
		model: mongoose.Model<any>,
		postId: string,
		userId: string,
	): Promise<any> {
		const query: object = { _id: mongoose.Types.ObjectId(postId)};
		const likeDoc: ILike = {
			user: mongoose.Types.ObjectId(userId),
			_createdAt: Date.now(),
		};
		return new Promise<any>((res, rej) => {
			model.updateOne(
				query,
				{
					$push : { likes: likeDoc }
				})
			.then((resolve: any) => {
				res(resolve);
			}).catch((err: any) => {
				rej(err);
			});
		});
	}

	static deleteLike (
		model: mongoose.Model<any>,
		postId: string,
		userId: string,
	): Promise<any> {
		const query: object = { _id: mongoose.Types.ObjectId(postId)};
		
		return new Promise<any>((res, rej) => {
			model.updateOne(
				query,
				{
					$pull : { likes: {user: userId} }
				})
			.then((resolve: any) => {
				res(resolve);
			}).catch((err: any) => {
				rej(err);
			});
		});
	}

	static setAgree (
		model: mongoose.Model<any>,
		feedbackId: string,
		userId: string,
	): Promise<any> {
		const query: object = {
			'feedback._id': mongoose.Types.ObjectId(feedbackId)
		};
		const agreeDoc: IAgree = {
			user: mongoose.Types.ObjectId(userId),
			_createdAt: Date.now(),
		};
		return new Promise<any>((res, rej) => {
			model.updateOne(
				query,
				{
					$push : { 
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

	static deleteAgree (
		model: mongoose.Model<any>,
		feedbackId: string,
		userId: string,
	): Promise<any> {
		const query: object = {
			'feedback._id': mongoose.Types.ObjectId(feedbackId)
		};
		
		return new Promise<any>((res, rej) => {
			model.updateOne(
				query,
				{
					$pull : { 'feedback.$.agrees': {user: mongoose.Types.ObjectId(userId)} }
				})
			.then((resolve: any) => {
				res(resolve);
			}).catch((err: any) => {
				rej(err);
			});
		});
	}

	static sendNotificiationToAll (content: string, destinationUrl: string): Promise<any>  {
		const query = {role: 'user'};
		const notification: INotification = {
			content,
			destinationUrl,
			_createdAt: Date.now(),
		}
		return new Promise<any>((res, rej) => {
			UserModel.updateMany(
				query,
				{
					$push : { notifications: notification }
				})
			.then((resolve: any) => {
				res(resolve);
			}).catch((err: any) => {
				rej(err);
			});
		});
	}

	static sendNotificationToUser (userId: string, content: string, destinationUrl: string = ''): Promise<any> {
		const query = {_id: mongoose.Types.ObjectId(userId)};
		const notification: INotification = {
			content,
			destinationUrl,
			_createdAt: Date.now(),
		}
		return new Promise<any>((res, rej) => {
			UserModel.updateOne(
				query,
				{
					$push : { notifications: notification }
				})
			.then((resolve: any) => {
				res(resolve);
			}).catch((err: any) => {
				rej(err);
			});
		});
	}
}

export default DBOperations;