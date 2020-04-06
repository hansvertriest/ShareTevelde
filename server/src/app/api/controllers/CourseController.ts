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
				.catch((err) => {
					const error = { msg: err.message, code: 412 }
					throw error;
				});
			return res.status(200).send();
		} catch (error) {
			this.logger.error(error.msg, error);
			return res.status(error.code).json(error);
		}

	}
}

export default CourseController;