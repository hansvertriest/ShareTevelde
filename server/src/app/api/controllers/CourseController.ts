import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { CourseModel, ICourse, CourseModelKeys } from '../../models/mongoose';
import {DBOperations} from '../../services/database';

class CourseController {
	private db: Connection;
	private logger: Logger;

	constructor() {
		this.db = mongoose.connection;
		this.logger = new Logger();
	}

	public new = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			// get body
			const { courseTitle, year, direction, schoolyear } = req.body;

			// create model 
			const course: ICourse = new CourseModel({
				courseTitle,
				year,
				direction,
				schoolyear,
			});

			// save model
			await course.save()
				.then((course) => {
					return res.status(200).send(course);
				})
				.catch((err) => {
					const error = { msg: err.message, code: 412 }
					throw error;
				});
			
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while creating course.', error);
			return res.status(500).send(error);
		}
	}

	public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.query;

			// get course
			const post: ICourse = await CourseModel.findById(mongoose.Types.ObjectId(id))
				.populate('assignment')
				.populate('pictures')
				.populate('user', 'profile.username _id')
				.exec();

			// check output and send response
			if (post) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No course with given id'}
			}

		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			return res.status(500).send(error);
		}
	}

	public getAll = async (req: Request,res: Response, next: NextFunction): Promise<Response<any>> => {
		try{
			// get parameters and keys
			const params = req.query;
			const paramKeys: string[] = Object.keys(req.query);

			// sanitize parameters
			const sanitizedParams: any = DBOperations.sanitizeParameters(params);

			// create filter
			const filter = DBOperations.createFilter(sanitizedParams);

			// get courses
			let courses: ICourse[] = await CourseModel.find(filter).exec();

			// check output and send response
			if (courses.length > 0) {
				return res.status(200).json(courses);
			} else {
				throw { code: 404, msg: 'No courses found.' };
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send({msg: error.msg});
			this.logger.error('Error while getting courses.', error);
			res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public getAllAndSoftDeleted = async (req: Request,res: Response, next: NextFunction): Promise<Response<any>> => {
		try{
			// get parameters and keys
			const params = req.query;

			// sanitize parameters
			const sanitizedParams: any = DBOperations.sanitizeParameters(params);

			// create filter
			const filter = DBOperations.createFilter(sanitizedParams, true);

			// get courses
			let courses: ICourse[] = await CourseModel.find(filter).exec();

			// send response
			if (courses) {
				return res.status(200).json(courses);
			} else {
				throw { code: 404, msg: 'No courses found' };
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send({msg: error.msg})
			this.logger.error('Error while getting courses.', error);
			res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public softDeleteById = async (req: Request, res: Response,  next: NextFunction): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.body;

			// set boolean to true
			DBOperations.softDeleteById(CourseModel, id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No courses were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted.'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send({msg: error.msg})
			this.logger.error('Error while soft deleting course.', error);
			res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public undeleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.body;

			DBOperations.undeleteById(CourseModel, id)
				.then(() => {
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			this.logger.error('Error while undeleting course.', error);
			return res.status(500).send({msg: 'Unknown error occured.'});
		}
	}

	public permanentDelete = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		try {
			// delete all softDeleted courses
			DBOperations.permanentDelete(CourseModel)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No softdeleted courses were found.'}
					}
					return res.status(200).send();
				})
				.catch((error) => {
					throw error;
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while permenantly deleting course.', error);
			return res.status(500).send({msg: 'Unknown error occured.'});
		}
	}
}

export default CourseController;