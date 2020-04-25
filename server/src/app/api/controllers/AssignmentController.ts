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

	public getAssignmentById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			const { id } = req.query;
			const post: IAssignment = await AssignmentModel.findById(mongoose.Types.ObjectId(id)).populate('assignment').populate('pictures').populate('user', 'profile.username _id').exec();

			if (post) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No assignment with that id'}
			}
		} catch (error) {
			if (error.code) {
				return res.status(error.code).send(error);
			}
			return res.status(500).send(error);
		}
	}

	public getAllAssignments = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			const params = req.query;
			const paramKeys: any = Object.keys(req.query);
			const filter: any = {softDeleted: false};
	  
			paramKeys.forEach((paramKey:string) => {
				filter[paramKey]  = params[paramKey];
			});
			const assignments: Array<IAssignment> = await AssignmentModel.find(filter).populate('courseId').exec();
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
			const filter: any = {};
	  
			paramKeys.forEach((paramKey:string) => {
				const value = (Array.isArray(JSON.parse(params[paramKey]))) ? {$in: JSON.parse(params[paramKey])} : params[paramKey]; 
				filter[paramKey]  = value;
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

	public softDeleteById = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		// verify token
		const { id } = req.body;
		
		try {
			// set boolean to true
			const update = await AssignmentModel.updateOne(
				{ _id: mongoose.Types.ObjectId(id)},
				{
					$set : {[`softDeleted`] : true}
				})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No assignment were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			this.logger.error('Error while soft deleting assignment', error);
			return res.status(500).send(error);
		}
	}

	public undeleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		// verify token
		const { id } = req.body;
		
		try {
			// set boolean to true
			const update = await AssignmentModel.updateOne(
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
			this.logger.error('Error while undeleting assignment', error);
			return res.status(500).send(error);
		}
	}

	public permanentDelete = async ( req: Request, res: Response,  next: NextFunction): Promise<Response<any>> => {
		try {
			const deletion = await AssignmentModel.deleteMany({softDeleted: true})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No Assignments to delete.'}
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

export default AssignmentController;