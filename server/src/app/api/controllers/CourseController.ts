import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { CourseModel, ICourse, CourseModelKeys } from '../../models/mongoose';

class CourseController {
	private db: Connection;
	private logger: Logger;

	constructor() {
		this.db = mongoose.connection;
		this.logger = new Logger();
	}

	public newCourse = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			const { courseTitle, year, direction, schoolyear } = req.body;

			const course: ICourse = new CourseModel({
				courseTitle,
				year,
				direction,
				schoolyear,
			});

			const newcourse = await course.save()
				.then((course) => {
					return res.status(200).send(course);
				})
				.catch((err) => {
					const error = { msg: err.message, code: 412 }
					throw error;
				});
			
		} catch (error) {
			this.logger.error(error.msg, error);
			return res.status(error.code).json(error);
		}
	}

	public getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			const { id } = req.query;
			const post: ICourse = await CourseModel.findById(mongoose.Types.ObjectId(id)).populate('assignment').populate('pictures').populate('user', 'profile.username _id').exec();

			if (post) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No course with that id'}
			}
		} catch (error) {
			if (error.code) {
				return res.status(error.code).send(error);
			}
			return res.status(500).send(error);
		}
	}

	public getAllCourses = async (req: Request,res: Response, next: NextFunction): Promise<Response<any>> => {
		try{
			const params = req.query;
			const paramKeys: any = Object.keys(req.query);
			const filter: any = {};
			filter.softDeleted = false;
			paramKeys.forEach((paramKey:string) => {
				const value = (Array.isArray(JSON.parse(params[paramKey]))) ? {$in: JSON.parse(params[paramKey])} : params[paramKey]; 
				filter[paramKey]  = value;
			});
			// get courses
			let courses: ICourse[] = await CourseModel.find(filter).exec();

			// send response
			if (courses) {
				return res.status(200).json(courses);
			} else {
				throw { code: 404, msg: 'No courses found' };
			}

		} catch (error) {
			if (error.code) {
				res.status(error.code).send({msg: error.msg})
			} else {
				this.logger.error('Error while getting courses', error);
				res.status(500).send({msg: 'unknown error occured'})
			}
		}
	}

	public getAllCoursesAndSoftDeleted = async (req: Request,res: Response, next: NextFunction): Promise<Response<any>> => {
		try{
			const params = req.query;
			const paramKeys: any = Object.keys(req.query);
			const filter: any = {};
			paramKeys.forEach((paramKey:string) => {
				const value = (Array.isArray(JSON.parse(params[paramKey]))) ? {$in: JSON.parse(params[paramKey])} : params[paramKey]; 
				filter[paramKey]  = value;
			});
			// get courses
			let courses: ICourse[] = await CourseModel.find(filter).exec();

			// send response
			if (courses) {
				return res.status(200).json(courses);
			} else {
				throw { code: 404, msg: 'No courses found' };
			}

		} catch (error) {
			if (error.code) {
				res.status(error.code).send({msg: error.msg})
			} else {
				this.logger.error('Error while getting courses', error);
				res.status(500).send({msg: 'unknown error occured'})
			}
		}
	}

	public softDeleteCourseById = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		// verify token
		const { id } = req.body;
		
		try {
			// set boolean to true
			const update = await CourseModel.updateOne(
				{ _id: mongoose.Types.ObjectId(id)},
				{
					$set : {[`softDeleted`] : true}
				})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No courses were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			this.logger.error('Error while soft deleting course', error);
			return res.status(500).send(error);
		}
	}

	public undeleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		// verify token
		const { id } = req.body;
		
		try {
			// set boolean to true
			const update = await CourseModel.updateOne(
				{ _id: mongoose.Types.ObjectId(id)},
				{
					$set : {[`softDeleted`] : false}
				})
				.then((resolve) => {
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			this.logger.error('Error while undeleting user', error);
			return res.status(500).send(error);
		}
	}

	public permanentDelete = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		try {
			const deletion = await CourseModel.deleteMany({softDeleted: true})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No courses were found.'}
					}
					return res.status(200).send();
				})
				.catch((error) => {
					throw error;
				});
		} catch (error) {
			if (error.msg) {
				return res.status(error.code).send(error);
			}
			return res.status(500).send({msg: 'Unknown error occured'});
		}
	}
}

export default CourseController;