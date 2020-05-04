import { NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection, mongo } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { IPost, PostModel } from '../../models/mongoose';
import { PictureModel, IPicture,  AssignmentModel, IAssignment, ICourse, CourseModel, IFeedback  } from '../../models/mongoose';
import {DBOperations} from '../../services/database';
import { exec } from 'child_process';

interface IPostModifications {
	assignment: IAssignment['_id'];
	urlToProject: string;
	pictures: IPicture['_id'][];
}

interface IPostFilter {
	direction?: string;
	schoolyear?: string;
}

class PostController {
	private logger: Logger;

	constructor() {
		this.logger = new Logger();
	}

	public new = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			const { assignmentId, urlToProject, pictures, token } = req.body;
			const pictureIds = JSON.parse(pictures).map((foto: string) => {
				return mongoose.Types.ObjectId(foto);
			}); 

			// check if pictures exist
			pictureIds.forEach(async (id: mongoose.Types.ObjectId) => {
				const picture: IPicture[] = await PictureModel.find({_id: id}).exec()
				if (picture.length === 0) {
					return res.status(404).send({msg: 'Given pictures were not found'})
				}
			});

			// check if assignment exists
			const assignment = await AssignmentModel.find({_id: mongoose.Types.ObjectId(assignmentId), softDeleted: false});
			if (assignment.length === 0) throw {code: 404, msg: 'Given assignment was not found'};

			const post: IPost = new PostModel({
				assignment: mongoose.Types.ObjectId(assignmentId),
				urlToProject,
				pictures: pictureIds,
				user: mongoose.Types.ObjectId(token.id),
			});

			await post.save()
				.then((response) => {
					return res.status(200).send(response);
				})
				.catch((error) => {
					return res.status(500).send({code: 500, msg: 'Unknown error occured.'});
				});
		}catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while creating post.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'});
		}
	}

	public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.query;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}
			
			// get course
			const post: IPost = await PostModel.findById(mongoose.Types.ObjectId(id))
				.populate({
					path: 'assignment',
					populate: {
						path: 'courseId',
					},
				})
				.populate('pictures')
				.populate('user', 'profile.username _id')
				.exec();

			// check output and send response
			if (post) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No post with that id'}
			}
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while getting post.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get parameters and keys
			const params = req.query;
			const limit = (req.query.limit) ? parseInt(req.query.limit) : undefined;
			const pageNr = (req.query.pageNr) ? parseInt(req.query.pageNr) : undefined;

			// sanitize parameters
			const sanitizedParams: any = DBOperations.sanitizeParameters(params);

			// create filter
			const filter = DBOperations.createFilter(sanitizedParams);

			// get posts
			let posts: IPost[] = await PostModel.find(filter)
				.populate({
					path: 'assignment',
					populate: {
						path: 'courseId',
					}
				})
				.populate('pictures')
				.populate('user', 'profile.username profile.profilePictureName _id')
				.sort([['_createdAt', 'desc']])
				.exec();
			
			// paginate
			if ( limit !== undefined && pageNr !== undefined){
				 posts = DBOperations.paginate(posts, limit, pageNr);
			}

			if (posts.length > 0) {
				return res.status(200).send(posts);
			} else {
				throw {code: 404, msg: 'No posts found.'}
			}
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while getting post.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public getAllFiltered = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get parameters and keys
			const params = req.query;
			const limit = (req.query.limit) ? parseInt(req.query.limit) : undefined;
			const pageNr = (req.query.pageNr) ? parseInt(req.query.pageNr) : undefined;
			const { direction, schoolyear } = req.query;

			// sanitize parameters
			const sanitizedParams: any = DBOperations.sanitizeParameters(params);

			// create filter
			const filter: IPostFilter = DBOperations.createFilter(sanitizedParams);

			// get fitting courses
			let courses: ICourse[] = await CourseModel.find(filter)
				.select('_id')
				.exec()
			const courseIds = courses.map((course) => course._id);
			if (courseIds.length < 0) throw {code: 404, msg: 'No posts found. {c}'};

			// get corresponding assignments
			const assignmentIds = await DBOperations.getWithIds(AssignmentModel, 'courseId', courseIds, true);
			if (assignmentIds.length < 0) throw {code: 404, msg: 'No posts found. {a}'};
			
			// get corresponding posts
			let posts: IPost[] = await DBOperations.getPostsWithIds(PostModel, 'assignment', assignmentIds);

			// paginate
			if ( limit !== undefined && pageNr !== undefined){
				 posts = DBOperations.paginate(posts, limit, pageNr);
			}

			if (posts.length > 0) {
				return res.status(200).send(posts);
			} else {
				throw {code: 404, msg: 'No posts found.'}
			}
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while getting post.', error);
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

			// get posts
			const post: IPost[] = await PostModel.find(filter)
				.populate({
					path: 'assignment',
					populate: {
						path: 'courseId',
					},
				})
				.populate('pictures')
				.populate('user', 'profile.username _id')
				.sort([['_createdAt', 'desc']])
				.exec();

			if (post.length > 0) {
				return res.status(200).send(post);
			} else {
				throw {code: 404, msg: 'No posts found.'}
			}
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while getting posts.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	
	public updateOwn = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get body and pictures
			const { assignmentId, pictures, urlToProject, id, token } = req.body;
			const pictureIds = JSON.parse(pictures).map((foto: string) => {
				return mongoose.Types.ObjectId(foto);
			}); 

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
			
			// construct modifications object
			const modifications: IPostModifications = {
				assignment: assignmentId,
				pictures,
				urlToProject,
			};
			
			// sanitize parameters
			const sanitizedModifications: IPostModifications = DBOperations.sanitizeParameters(modifications);

			await PostModel.updateOne(
				{ _id: mongoose.Types.ObjectId(id), user: mongoose.Types.ObjectId(token.id)},
				{ $set: sanitizedModifications})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No posts were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'No modifications were made.'}
					}
					return res.status(200).send();
				}).catch((error) => {
					if (error.code) return res.status(error.code).send(error);
				});
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while updating post.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public softDeleteOwn = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try {
			// get id
			const userId = req.body.token.id;
			const postId = req.body.id;
			if (userId.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}
			if (postId.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// set boolean to true
			DBOperations.softDeleteById(PostModel, postId, userId)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No posts were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted.'}
					}
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.code) return res.status(error.code).send(error);
				});
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured softdeleting post.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public softDeleteById = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.body;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// set boolean to true
			DBOperations.softDeleteById(PostModel, id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No posts were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted.'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			if (error.code) return res.status(error.code).send(error);
			this.logger.error('Unknown error occured while softdeleting post.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public undeleteById = async (req: Request,res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.body;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// set boolean to true
			DBOperations.undeleteById(PostModel, id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'Given post was not found.'}
					}
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.msg) return res.status(error.code).send(error)
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while undeleting post.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public permanentDelete = async ( req: Request, res: Response,  next: NextFunction): Promise<Response<any>> => {
		try {
			// delete all softDeleted users
			DBOperations.permanentDelete(PostModel)
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
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while permenantly deleting posts.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public postFeedback = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get body
			const { postId, token, content } = req.body;

			// construct feedback
			const feedback: IFeedback = {
				user: mongoose.Types.ObjectId(token.id),
				content,
				agrees: [],
				_createdAt: Date.now(),
			}
			// post feedback
			await PostModel.updateOne(
				{ _id: mongoose.Types.ObjectId(postId) },
				{
					$push : { feedback : feedback }
				})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'Given post was not found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted.'}
					}
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.msg) return res.status(error.code).send(error)
				});

		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while permenantly deleting posts.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public agree = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get body 
			const { id, token } = req.body;

			// check if already agreed
			const check = await PostModel.find({
				'feedback.agrees.user': mongoose.Types.ObjectId(token.id),
			})
				.exec();

			// set boolean to value like
			if (check.length === 0) {
				DBOperations.setAgree(PostModel, id, token.id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'Given feedback was not found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was agreed.'}
					}
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.msg) return res.status(error.code).send(error)
				});
			} else {
				DBOperations.deleteAgree(PostModel, id, token.id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'Given feedback was not found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was agreed.'}
					}
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.msg) return res.status(error.code).send(error)
				});
			}
		} catch(error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while permenantly deleting posts.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public getAgrees = async (req: Request, res: Response, nex: NextFunction): Promise<Response<any>> => {
		try {
			// get parameter
			const { id } = req.query;

			// get likes
			const agrees = await PostModel.find({ 'feedback._id': mongoose.Types.ObjectId(id) })
				.select('feedback.agrees')
				.populate('feedback.agrees.user', 'profile');

			// check output and send response
			if (agrees.length > 0) {
				return res.status(200).send(agrees);
			} else {
				throw {code: 404, msg: 'No post with that id'}
			}
		} catch(error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while permenantly deleting posts.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public like = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
		try {
			// get body 
			const { id, token } = req.body;

			// check if already liked
			const check = await PostModel.find({
				'likes.user': mongoose.Types.ObjectId(token.id),
			})
				.exec();
			
			if (check.length === 0) {
				// set boolean to value like
				DBOperations.setLike(PostModel, id, token.id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'Given post was not found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted.'}
					}
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.msg) return res.status(error.code).send(error)
				});
			} else {
				// set boolean to value like
				DBOperations.deleteLike(PostModel, id, token.id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'Given like was not found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was deleted.'}
					}
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.msg) return res.status(error.code).send(error)
				});
			}
			
		} catch(error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while permenantly deleting posts.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public getLikes = async (req: Request, res: Response, nex: NextFunction): Promise<Response<any>> => {
		try {
			// get parameter
			const { id } = req.query;

			// get likes
			const likes = await PostModel.find({ _id: mongoose.Types.ObjectId(id) })
				.select('likes')
				.populate('likes.user', 'profile');

			// check output and send response
			if (likes.length > 0) {
				return res.status(200).send(likes);
			} else {
				throw {code: 404, msg: 'No post with that id'}
			}
		} catch(error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while permenantly deleting posts.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}
}

export default PostController;
