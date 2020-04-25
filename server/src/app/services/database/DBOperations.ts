import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection, Model } from 'mongoose';


import { CourseModel, ICourse, AssignmentModel, IAssignment, UserModel, IUser, PostModel, IPost } from '../../models/mongoose';
import { resolve } from 'dns';

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
		model: any,
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
		model: any,
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
}

export default DBOperations;