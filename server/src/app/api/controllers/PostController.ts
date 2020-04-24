import { NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { IPost, PostModel  } from '../../models/mongoose';
import { PictureModel, IPicture,  AssignmentModel, UserModel  } from '../../models/mongoose';

interface IPostModifications {
	[index: string]: string;
}


class PostController {
	private logger: Logger;

	constructor() {
		this.logger = new Logger();
	}

	public uploadPost = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			const { assignmentId, urlToProject, pictures, token } = req.body;
			const pictureIds = JSON.parse(pictures).map((foto: string) => {
				return mongoose.Types.ObjectId(foto);
			}); 

			
			// check if pictures exist
			let picture;
			pictureIds.forEach(async (id: mongoose.Types.ObjectId) => {
				const picture: IPicture[] = await PictureModel.find({_id: id}).exec()
				if (picture.length === 0) {
					return res.status(404).send({msg: 'Given pictures were not found'})
				}
			});

			// check if assignment exists
			const assignment = await AssignmentModel.find({_id: mongoose.Types.ObjectId(assignmentId)});
			if (assignment.length === 0) throw {code: 404, msg: 'Given assignment was not found'};

			const post: IPost = new PostModel({
				assignment: mongoose.Types.ObjectId(assignmentId),
				urlToProject,
				pictures: pictureIds,
				user: mongoose.Types.ObjectId(token.id),
			});

			post.save()
				.then((response) => {
					return res.status(200).send(response);
				})
				.catch((error) => {throw error});
		}catch (error) {
			if (error.code) {
				return res.status(error.code).send(error);
			}

			console.log(error);
			return res.status(500).send({ msg: 'unknown error'});
		}
	}

	public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			const { id } = req.query;
			const post: IPost = await PostModel.findById(mongoose.Types.ObjectId(id)).populate('assignment').populate('pictures').populate('user', 'profile.username _id').exec();

			if (post) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No post with that id'}
			}
		} catch (error) {
			if (error.code) {
				return res.status(error.code).send(error);
			}
			return res.status(500).send(error);
		}
	}

	public getPostsAll = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			const params = req.query;
			const paramKeys: any = Object.keys(req.query);
			const filter: any = {};
			filter.softDeleted = false;
			paramKeys.forEach((paramKey:string) => {
				const value = (Array.isArray(JSON.parse(params[paramKey]))) ? {$in: JSON.parse(params[paramKey])} : params[paramKey]; 
				filter[paramKey]  = value;
			});

			const post: IPost[] = await PostModel.find(filter).populate('assignment').populate('pictures').populate('user', 'profile.username _id').exec();

			if (post.length !== 0) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No posts found'}
			}
		} catch (error) {
			if (error.code) {
				return res.status(error.code).send(error);
			}
			console.log(error)
			return res.status(500).send(error);
		}
	}

	public getPostsAllAndSoftDeleted = async (req: Request,res: Response, next: NextFunction): Promise<Response<any>> => {
		try{
			const params = req.query;
			const paramKeys: any = Object.keys(req.query);
			const filter: any = {};
			paramKeys.forEach((paramKey:string) => {
				const value = (Array.isArray(JSON.parse(params[paramKey]))) ? {$in: JSON.parse(params[paramKey])} : params[paramKey]; 
				filter[paramKey]  = value;
			});

			const post: IPost[] = await PostModel.find(filter).populate('assignment').populate('pictures').populate('user', 'profile.username _id').exec();

			if (post.length !== 0) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No posts found'}
			}
		} catch (error) {
			if (error.code) {
				return res.status(error.code).send(error);
			}
			console.log(error)
		}
	}

	public updateOwnPost = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		const propKeys = Object.keys(req.body).filter((key) => key !== 'id');
		const { assignmentId, pictures, urlToProject, id, token } = req.body;
		console.log(id, token);
		const pictureIds = JSON.parse(pictures).map((foto: string) => {
			return mongoose.Types.ObjectId(foto);
		}); 

		try {
			// check if pictures exist
			pictureIds.forEach(async (id: mongoose.Types.ObjectId) => {
				const picture: IPicture[] = await PictureModel.find({_id: id}).exec()
				if (picture.length === 0) {
					return res.status(404).send({msg: 'Given pictures were not found'})
				}
			});

			// check if assignment exists
			const assignment = await AssignmentModel.find({_id: mongoose.Types.ObjectId(assignmentId)});
			if (assignment.length === 0) throw {code: 404, msg: 'Given assignment was not found'};
			
			const modifications: IPostModifications = {
				assignment: assignmentId,
				pictures: pictureIds,
				urlToProject,
			};
			

			await PostModel.updateOne({ _id: mongoose.Types.ObjectId(id), user: mongoose.Types.ObjectId(token.id)}, { $set: modifications})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No posts were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'No modifications were made.'}
					}
					return res.status(200).send();
				}).catch((error) => {
					throw error;
				});
		} catch (error) {
			if (error.code) {
				return res.status(error.code).send(error)
			}
			this.logger.error('Error while updating post.' ,error);
			return res.status(500).send({msg: 'unknown error'})
		}
	}

	public softDeleteOwn = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		// verify token
		const { id, token } = req.body;
		
		try {
			// set boolean to true
			const update = await PostModel.updateOne(
				{ _id: mongoose.Types.ObjectId(id), user: mongoose.Types.ObjectId(token.id)},
				{
					$set : {[`softDeleted`] : true}
				})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No posts were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			this.logger.error('Error while soft deleting post', error);
			return res.status(500).send(error);
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
			const update = await PostModel.updateOne(
				{ _id: mongoose.Types.ObjectId(id)},
				{
					$set : {[`softDeleted`] : true}
				})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No posts were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			if (error.msg) {
				return res.status(error.code).send(error);
			}
			this.logger.error('Error while soft deleting post', error);
			return res.status(500).send(error);
		}
	}

	public permanentDelete = async ( req: Request, res: Response,  next: NextFunction): Promise<Response<any>> => {
		try {
			const deletion = await PostModel.deleteMany({softDeleted: true})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No posts to delete.'}
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

	public undeleteById = async (req: Request,res: Response, next: NextFunction): Promise<Response<any>> => {
		// verify token
		const { id } = req.body;
		
		try {
			// set boolean to true
			const update = await PostModel.updateOne(
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
}

export default PostController;
