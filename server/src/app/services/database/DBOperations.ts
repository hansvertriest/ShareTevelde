import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection, Model } from 'mongoose';


import { CourseModel, ICourse, AssignmentModel, IAssignment, UserModel, IUser, PostModel, IPost } from '../../models/mongoose';
import { resolve } from 'dns';

class DBOperations {
	static getById (
		id: string,
		model: ICourse | IAssignment | IUser | IPost,
		populateParameter: string,
	) {
		return new Promise((res, rej) => {
			CourseModel.findById(mongoose.Types.ObjectId(id)).populate('assignment')
				 .populate('pictures')
				 .populate('user', 'profile.username _id')
				 .exec()
				.then((response) => {
					res(response);
				})
				.catch((err) => {
					rej(err);
				});
		});
	}

	static sanitizeParameters (parameters: any): any {
		const paramKeys: string[] = Object.keys(parameters);
		const sanitizedParams: any = {};
		
		paramKeys.forEach((paramKey: string) => {
			if (parameters[paramKey].includes('[') && Array.isArray(JSON.parse(parameters[paramKey]))) {
				const sanitizedArray = JSON.parse(parameters[paramKey]).map((str: string) => str.trim());
				sanitizedParams[paramKey] = sanitizedArray;
			} else {
				sanitizedParams[paramKey] = parameters[paramKey].trim();
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
	): Promise<any> {
		return new Promise<any>((res, rej) => {
			model.updateOne(
				{ _id: mongoose.Types.ObjectId(id)},
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
	): Promise<any> {
		return new Promise<any>((res, rej) => {
			model.updateOne(
				{ _id: mongoose.Types.ObjectId(id)},
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