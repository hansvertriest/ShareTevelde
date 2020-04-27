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
					if (err.code === 11000) {
						return res.status(412).send({code: 500, msg: 'Duplicate Course'});
					}
					this.logger.error('Unknown error occured while creating course.', err);
					return res.status(500).send({code: 500, msg: 'Unknown error occured.'});
				});
			
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while creating course.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'});
		}
	}

	public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.query;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// get course
			const post: ICourse = await CourseModel.findById(mongoose.Types.ObjectId(id)).exec();

			// check output and send response
			if (post) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No course with given id'}
			}

		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while getting course.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public getAll = async (req: Request,res: Response, next: NextFunction): Promise<Response<any>> => {
		try{
			// get parameters and keys
			const params = req.query;

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
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting courses.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
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
			if (courses.length > 0) {
				return res.status(200).json(courses);
			} else {
				throw { code: 404, msg: 'No courses found.' };
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while getting courses.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public softDeleteById = async (req: Request, res: Response,  next: NextFunction): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.body;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

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
					if (err.msg) return res.status(err.code).send(err)
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while soft deleting course.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public undeleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.body;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// set boolean to false
			DBOperations.undeleteById(CourseModel, id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'Given course does not exist'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was undeleted.'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					if (err.msg) return res.status(err.code).send(err)
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while soft deleting course.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public permanentDelete = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try {
			// delete all softDeleted courses
			DBOperations.permanentDelete(CourseModel)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No courses to delete'}
					}
					return res.status(200).send();
				})
				.catch((err) => {
					if (err.msg) return res.status(err.code).send(err)
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while permenantly deleting course.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}
}

export default CourseController;