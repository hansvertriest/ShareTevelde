import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { AssignmentModel, IAssignment, AssignmentModelKeys } from '../../models/mongoose';
import {DBOperations} from '../../services/database';

class AssignmentController {
	private logger: Logger;

	constructor() {
		this.logger = new Logger();
	}

	public new = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			// get body
			const { title, courseId, description } = req.body;
		
			// create model
			const course: IAssignment = new AssignmentModel({
				title,
				courseId: mongoose.Types.ObjectId(courseId),
				description,
			});

			// save model
			await course.save()
				.then((assignment) => {
					return res.status(200).send(assignment);
				})
				.catch((err) => {
					const error = { msg: err.message, code: 412 }
					throw error;
				});
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while creating course.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}

	}

	public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get by id
			const { id } = req.query;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			const post: IAssignment = await AssignmentModel.findById(mongoose.Types.ObjectId(id))
				.populate('courseId')
				.exec();

			// check output and response
			if (post) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No assignment with that id'}
			}
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while getting assignment.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public getAll = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			// get parameters and keys
			const params = req.query;

			// sanitize parameters
			const sanitizedParams: any = DBOperations.sanitizeParameters(params);

			// create filter
			const filter = DBOperations.createFilter(sanitizedParams);

			// get assignments
			const assignments: IAssignment[] = await AssignmentModel
				.find(filter)
				.populate('courseId')
				.exec();

			// check output and send response
			if (assignments.length > 0) {
				return res.status(200).json(assignments);
			} else {
				throw { code: 404, msg: 'No assignments found.' };
			}
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting courses.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public getAllAndSoftDeleted = async (req: Request, res: Response, next: NextFunction) : Promise<Response<any>> => {
		try {
			// get parameters and keys
			const params = req.query;

			// sanitize parameters
			const sanitizedParams: any = DBOperations.sanitizeParameters(params);

			// create filter
			const filter = DBOperations.createFilter(sanitizedParams, true);

			// get assignments
			const assignments: Array<IAssignment> = await AssignmentModel.find(filter)
				.populate('courseId')
				.exec();

			// send response
			if (assignments.length > 0) {
				return res.status(200).json(assignments);
			} else {
				throw { code: 404, msg: 'No assignments found.' };
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting courses.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public softDeleteById = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {		
		try {
			// get id
			const { id } = req.body;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// set boolean to true
			DBOperations.softDeleteById(AssignmentModel, id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No assignments were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					if (err.msg) return res.status(err.code).send(err)
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while soft deleting assignment.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public undeleteById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		// verify token
		try {
			// get id
			const { id } = req.body;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}
		
			// set boolean to false
			DBOperations.undeleteById(AssignmentModel, id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No assignments were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					if (err.msg) return res.status(err.code).send(err)
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while soft deleting assignment.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public permanentDelete = async ( req: Request, res: Response,  next: NextFunction): Promise<Response<any>> => {
		try {
			// delete all softDeleted courses
			DBOperations.permanentDelete(AssignmentModel)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No Assignments to delete.'}
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

export default AssignmentController;