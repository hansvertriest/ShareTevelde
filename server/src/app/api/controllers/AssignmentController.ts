import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { AssignmentModel, IAssignment, AssignmentModelKeys } from '../../models/mongoose';

class AssignmentController {
	private db: Connection;
	private logger: Logger;

	constructor() {
		this.db = mongoose.connection;
		this.logger = new Logger();
	}

	public showAll = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			const assignments: Array<IAssignment> = await AssignmentModel.find().populate('_courseId').exec();
			return res.status(200).json(assignments);
		} catch (error) {
			this.logger.error(error.msg, error);
			return res.status(412).json(error);
		}
	}

	public newAssignment = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			const { assignmentTitle, courseId } = req.body;
			
			const course: IAssignment = new AssignmentModel({
				assignmentTitle,
				_courseId: mongoose.Types.ObjectId(courseId),
			});

			const newAssignment = await course.save()
				.catch((error) => {
					throw error.message;
				});
			return res.status(200).send();
		} catch (error) {
			this.logger.error(error.msg, error);
			return res.status(412).json(error);
		}

	}
}

export default AssignmentController;