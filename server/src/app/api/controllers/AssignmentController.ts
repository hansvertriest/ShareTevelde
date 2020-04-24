import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { AssignmentModel, IAssignment, AssignmentModelKeys } from '../../models/mongoose';
import { AuthService } from '../../services';

class AssignmentController {
	private db: Connection;
	private logger: Logger;
	private authService: AuthService;

	constructor(authService: AuthService) {
		this.db = mongoose.connection;
		this.logger = new Logger();
		this.authService = authService;
	}

	public getAllAssignments = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			const params = req.query;
			const paramKeys: any = Object.keys(req.query);
			const filter: any = {};
	  
			paramKeys.forEach((paramKey:string) => {
				filter[paramKey]  = params[paramKey];
			});
			const assignments: Array<IAssignment> = await AssignmentModel.find(filter).populate('_courseId').exec();
			return res.status(200).json(assignments);
		} catch (error) {
			this.logger.error(error.msg, error);
			return res.status(412).json({code: 412, msg: error});
		}
	}

	public getAllAssignmentsAndSoftDeleted = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			const params = req.query;
			const paramKeys: any = Object.keys(req.query);
			const filter: any = {softDeleted: true};
	  
			paramKeys.forEach((paramKey:string) => {
				filter[paramKey]  = params[paramKey];
			});
			const assignments: Array<IAssignment> = await AssignmentModel.find(filter).populate('_courseId').exec();
			return res.status(200).json(assignments);
		} catch (error) {
			this.logger.error(error.msg, error);
			return res.status(412).json(error);
		}
	}

	public newAssignment = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			const { title, courseId, description } = req.body;
		
			const course: IAssignment = new AssignmentModel({
				title,
				courseId: mongoose.Types.ObjectId(courseId),
				description,
			});

			const newAssignment = await course.save()
				.then((assignment) => {
					return res.status(200).send(assignment);
				})
				.catch((error) => {
					throw error.message;
				});
		} catch (error) {
			this.logger.error(error.msg, error);
			return res.status(412).json(error);
		}

	}
}

export default AssignmentController;