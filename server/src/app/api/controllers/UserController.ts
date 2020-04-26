import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { UserModel, IUser, IProfile } from '../../models/mongoose';
import { AuthService, IConfig,  } from '../../services';
import { NotFoundError } from '../../utilities';
import {DBOperations} from '../../services/database';


interface IUserModifications {
	[index: string]: string;
}

class UserController {
	private db: Connection;
	private logger: Logger;
	private authService: AuthService;
	private config: IConfig;

	constructor(config: IConfig, authService: AuthService) {
		this.db = mongoose.connection;
		this.logger = new Logger();
		this.authService = authService;
		this.config = config;
	}

	signupLocal = async ( req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
		const { email, password, role } = req.body;

		try {
			const hash = await this.authService.encrypt(password)
				.catch(() =>{
					const error = { code: 500, msg: 'failed to encrypt password' }
					throw error;
			})
	
			let foundUser = await UserModel.findOne({ email: email });
			if (foundUser) {
				const error = { code: 403, msg: 'Email is already in use' }
				throw error;
			}
			const newUser: IUser = new UserModel({
				email,
				localProvider: {
					password: hash
				},
				role
			});
	
			const user: IUser = await newUser.save();
	
			const token = this.authService.createToken(user);
			DBOperations.sendNotificationToUser(user.id, 'Welkom bij ShareTevelde!')
			return res.status(200).json({
				id: user.id,
				email: user.email, 
				token: `${token}`,
				strategy: 'local',
				role: user.role,
				avatar: user.profile.profileDescription,
			});
		} catch (error) {
			if (error.code) {
				res.status(error.code).json(error);
			} else{
				res.status(500).json(error);
			}
			this.logger.error(error.msg, error);
		}
		
	};

	signInLocal = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
		this.authService.passport.authenticate(
			'local',
			{ session: this.config.auth.jwt.session },
			(err, user, info) => {
				if (err) {
					return next(err);
				}
				if (!user) {
					return next(new NotFoundError());
				}
				const token = this.authService.createToken(user);
				return res.status(200).json({
					id: user.id,
					email: user.email,
					token: `${token}`,
					strategy: 'local',
					role: user.role,
					avatar: user.profile.avatar,
				});
			},
		)(req, res, next);
	};

	public getById = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try {
			const { id } = req.query;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// get user
			const user: IUser = await UserModel.findOne({_id: mongoose.Types.ObjectId(id), softDeleted: false})
			.select('profile id')
			.exec();

			// send response
			if (user) {
				return res.status(200).json(user);
			} else {
				throw { code: 404, msg: 'No user with that id.' };
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting user by id.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public getByIdAndSoftDeleted = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try {
			const { id } = req.query;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// get user
			const user: IUser = await UserModel.findOne({_id: mongoose.Types.ObjectId(id)}).exec();

			// send response
			if (user) {
				return res.status(200).json(user);
			} else {
				throw { code: 404, msg: 'No user with that id' };
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting user by id.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}
	
	public getAll = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try{
			// get parameters and keys
			const params = req.query;

			// sanitize parameters
			const sanitizedParams: any = DBOperations.sanitizeParameters(params, 'profile.');

			// create filter
			const filter = DBOperations.createFilter(sanitizedParams);
			console.log(filter);
			// get users
			let users: IUser[] = await UserModel.find(filter).select('profile id').exec();

			// send response
			if (users.length > 0) {
				return res.status(200).json(users);
			} else {
				throw { code: 404, msg: 'No users found' };
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting users.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public getAllAndSoftDeleted = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try{
			// get parameters and keys
			const params = req.query;

			// sanitize parameters
			const sanitizedParams: any = DBOperations.sanitizeParameters(params, 'profile.');

			// create filter
			const filter = DBOperations.createFilter(sanitizedParams, true);

			// get users
			let users: IUser[] = await UserModel.find(filter).exec();

			// send response
			if (users) {
				return res.status(200).json(users);
			} else {
				throw { code: 404, msg: 'No users found' };
			}

		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting users.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public updateProfileById = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response<any>> => {
		try {
			// get body
			const { username, profileDescription, profilePictureName, linkFb, linkInsta, linkTwitter, linkYt, linkVimeo} = req.body;

			// get id
			const { id } = req.body;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// construct modifications object
			let modifications: IProfile = {
				username,
				profileDescription,
				profilePictureName,
				linkFb,
				linkInsta,
				linkTwitter,
				linkYt,
				linkVimeo,
			}
			
			// sanitize parameters
			const sanitizedModifications: IProfile = DBOperations.sanitizeParameters(modifications, 'profile.');

			// apply modifications
			await UserModel.updateOne({ _id: mongoose.Types.ObjectId(id)}, { $set: sanitizedModifications})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No users were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'No modifications were made.'}
					}
					return res.status(200).send();
				}).catch((error) => {
					if (error.msg) return res.status(error.code).send(error);
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting users.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'});
		}
	}

	public updateProfileByToken = async ( req: Request, res: Response, next: NextFunction ) : Promise<Response<any>> => {
		try {			
			// get body
			const { username, profileDescription, profilePictureName, linkFb, linkInsta, linkTwitter, linkYt, linkVimeo} = req.body;

			// get id
			const id = req.body.token.id;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// construct modifications object
			let modifications: IProfile = {
				username,
				profileDescription,
				profilePictureName,
				linkFb,
				linkInsta,
				linkTwitter,
				linkYt,
				linkVimeo,
			}
			
			// sanitize parameters
			const sanitizedModifications: any = DBOperations.sanitizeParameters(modifications, 'profile.');

			// apply modifications
			await UserModel.updateOne({ _id: mongoose.Types.ObjectId(id)}, { $set: sanitizedModifications})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No users were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'No modifications were made.'}
					}
					return res.status(200).send();
				}).catch((error) => {
					if (error.msg) return res.status(error.code).send(error);
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting users.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}
	
	public softDeleteById = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.body;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// set boolean to true
			DBOperations.softDeleteById(UserModel, id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No users were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothong was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.msg) return res.status(error.code).send(error);
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting users.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
		
	}

	public softDeleteByToken = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try {
			// get id
			const id = req.body.token.id;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// set boolean to true
			DBOperations.softDeleteById(UserModel, id)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No users were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothing was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.msg) return res.status(error.code).send(error);
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while getting users.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}

	public undeleteById = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try {
			// get id
			const { id } = req.body;
			if (id.length !== 24 ) throw {code: 412, msg: 'Incorrect id.'}

			// set boolean to true
			DBOperations.undeleteById(UserModel, id)
				.then((resolve) => {
					return res.status(200).send();
				})
				.catch((error) =>{
					if (error.msg) return res.status(error.code).send(error)
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error)
			this.logger.error('Error while undeleting course.', error);
			return res.status(500).send({msg: 'Unknown error occured.'})
		}
	}

	public permanentDelete = async ( req: Request, res: Response,  next: NextFunction ): Promise<Response<any>> => {
		try {
			// delete all softDeleted users
			DBOperations.permanentDelete(UserModel)
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No users were found.'}
					}
					return res.status(200).send();
				})
				.catch((error) => {
					if (error.msg) return res.status(error.code).send(error);
				});
		} catch (error) {
			if (error.msg) return res.status(error.code).send(error);
			this.logger.error('Error while permenantly deleting courses.', error);
			return res.status(500).send({code: 500, msg: 'Unknown error occured.'})
		}
	}



	
	public sendOk = async ( req: Request, res: Response, next: NextFunction ): Promise<Response<any>> => {
		return res.status(200).send();
	}
}

export default UserController;