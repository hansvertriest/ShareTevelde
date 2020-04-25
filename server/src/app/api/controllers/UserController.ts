import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { UserModel, IUser, UserModelProperties, userForbiddenFilters, PostModel } from '../../models/mongoose';
import { AuthService, IConfig,  } from '../../services';
import { IVerifiedToken } from '../../services/auth';
import { NotFoundError } from '../../utilities';
import { decode } from 'punycode';


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

	public getByTokenOrId = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		try {
			const { token } = req.body;
			const { id } = req.query;

			const userId = (id) ? id : token.id
			// check id length
			if (id.length != 24) {
				throw { code: 412, msg: 'Id has not the required length' };
			}

			// get user
			const user: IUser = await UserModel.findOne(
				{
					_id: mongoose.Types.ObjectId(userId),
				}
			).select('profile id').exec();

			// send response
			if (user) {
				return res.status(200).json(user);
			} else {
				throw { code: 404, msg: 'No user with that id' };
			}

		} catch (error) {
			if (error.code) {
				res.status(error.code).send({msg: error.msg})
			} else {
				this.logger.error('Error while getting a user', error);
				res.status(500).send({msg: 'unknown error occured'})
			}
		}
	}

	public getByTokenOrIdAndSoftDeleted = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		try {
			console.log('ddfdfwssdf')
			const { token } = req.body;
			const { id } = req.query;

			// check id length
			if (id.length != 24) {
				throw { code: 412, msg: 'Id has not the required length' };
			}

			// get user
			const user: IUser = await UserModel.findOne(
				{
					_id: mongoose.Types.ObjectId(id),
				}
			).exec();

			// send response
			if (user) {
				return res.status(200).json(user);
			} else {
				throw { code: 404, msg: 'No user with that id' };
			}

		} catch (error) {
			if (error.code) {
				res.status(error.code).send({msg: error.msg})
			} else {
				this.logger.error('Error while getting a user', error);
				res.status(500).send({msg: 'unknown error occured'})
			}
		}
	}
	
	public getAll = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		try{
			const params = req.query;
			const paramKeys: any = Object.keys(req.query);
			const filter: any = {};
			filter.softDeleted = false;
			paramKeys.forEach((paramKey:string) => {
				if (!userForbiddenFilters.includes(paramKey)) {
					const value = (Array.isArray(JSON.parse(params[paramKey]))) ? {$in: JSON.parse(params[paramKey])} : params[paramKey];
					filter[`profile.${paramKey}`]  = value;
				}
			});
			// get users
			let users: IUser[] = await UserModel.find(filter).select('profile id').exec();

			// send response
			if (users) {
				return res.status(200).json(users);
			} else {
				throw { code: 404, msg: 'No users found' };
			}

		} catch (error) {
			if (error.code) {
				res.status(error.code).send({msg: error.msg})
			} else {
				this.logger.error('Error while getting a user', error);
				res.status(500).send({msg: 'unknown error occured'})
			}
		}
	}

	public getAllAndSoftDeleted = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		try{
			const params = req.query;
			const paramKeys: any = Object.keys(req.query);
			const filter: any = {};
			paramKeys.forEach((paramKey:string) => {
				if (!userForbiddenFilters.includes(paramKey)) {
					filter[paramKey]  = params[paramKey];
				}
			});

			// get users
			let users: IUser[] = await UserModel.find(filter).exec();

			// send response
			if (users) {
				return res.status(200).json(users);
			} else {
				throw { code: 404, msg: 'No users found' };
			}

		} catch (error) {
			if (error.code) {
				res.status(error.code).send({msg: error.msg})
			} else {
				this.logger.error('Error while getting a user', error);
				res.status(500).send({msg: 'unknown error occured'})
			}
		}
	}

	public updateProfileById = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) : Promise<Response<any>> => {
		const id = req.body.id;
		const propKeys = Object.keys(req.body).filter((propKey) => propKey !== 'token' && propKey != 'id');
		const modifications: IUserModifications = {};

		propKeys.forEach(async (key: string) => {
			modifications[`profile.${key}`] = req.body[key];
		});

		try {
			await UserModel.updateOne({ _id: mongoose.Types.ObjectId(id)}, { $set: modifications})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No users were found.'}
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
			return res.status(500).send(error)
		}
	}

	public updateProfileByToken = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) : Promise<Response<any>> => {
		const token = req.body.token;
		const propKeys = Object.keys(req.body).filter((propKey) => propKey !== 'token' && propKey != 'id');
		const modifications: IUserModifications = {};

		propKeys.forEach(async (key: string) => {
			modifications[`profile.${key}`] = req.body[key];
		});

		try {
			await UserModel.updateOne({ _id: mongoose.Types.ObjectId(token.id)}, { $set: modifications})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No users were found.'}
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
			return res.status(500).send(error)
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
			const update = await UserModel.updateOne(
				{ _id: mongoose.Types.ObjectId(id)},
				{
					$set : {[`softDeleted`] : true}
				})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No users were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothong was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			this.logger.error('Error while soft deleting user', error);
			return res.status(500).send(error);
		}
		
	}

	public softDeleteByToken = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		// verify token
		const { token } = req.body;
		
		try {
			// set boolean to true
			UserModel.updateOne(
				{ _id: mongoose.Types.ObjectId(token.id)},
				{
					$set : {[`softDeleted`] : true}
				})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No users were found.'}
					} else if (resolve.nModified === '0') {
						throw {code: 500, msg: 'Nothong was softdeleted'}
					}
					return res.status(200).send();
				})
				.catch((err) =>{
					throw err;
				});
		} catch (error) {
			this.logger.error('Error while soft deleting user', error);
			return res.status(500).send(error);
		}
	}

	public undeleteById = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		// verify token
		const { id } = req.body;
		
		try {
			// set boolean to true
			const update = await UserModel.updateOne(
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

	public permanentDelete = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<Response<any>> => {
		try {
			const deletion = await UserModel.deleteMany({softDeleted: true})
				.then((resolve) => {
					if (resolve.n === 0) {
						throw {code: 404, msg: 'No Users were found.'}
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

	signupLocal = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
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

	signInLocal = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		console.log('============');
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

	
	public sendOk = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response<any>> => {
		return res.status(200).send();
	}
}

export default UserController;