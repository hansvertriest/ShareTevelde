import { default as express, NextFunction, Request, Response } from 'express';
import { default as mongoose, Connection } from 'mongoose';

import Logger, { ILogger } from '../../services/logger';
import { User, IUser, UserModelProperties } from '../../models/mongoose';
import { AuthService, IConfig,  } from '../../services';
import { IVerifiedToken } from '../../services/auth';
import { NotFoundError } from '../../utilities';
import { decode } from 'punycode';

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

	public getUser = async (
		req: Request,
		res: Response, 
		next: NextFunction,
	): Promise<void> => {
		const { id } = req.params;
		const user: IUser = await User.findById(id).exec();
		res.status(200).json(user);
	}

	public updateUserProfile = async (
		req: Request,
    res: Response,
    next: NextFunction,
	) : Promise<void> => {
		try {
			const paramKeys = Object.keys(req.body);
      // verify token
      let token: IVerifiedToken;

			if (!paramKeys.includes('token')) {
				const error = {msg: 'No token was given!'};
				throw error;
			} else {
        token = this.authService.verifyToken(req.body.token);
      }

      // update properties
      if (token.verified) {
        paramKeys.forEach((key) => {
          if (key != 'token' && UserModelProperties.includes(`profile.${key}`)) {
            this.db.collection('users').updateOne(
              { _id: mongoose.Types.ObjectId(token.id)},
              {
                $set : {[`profile.${key}`] : req.body[key]}
              }
            ).catch((err) =>{
              throw err;
            });
          } else if ( key != 'token' ) {
            const error = { msg: `Property [${key}] does not exist in user.profile` };
            throw error;
          }
        });
      } else {
        throw token.error || token.unknownError;
      }

			//send status OK
			res.status(200).send();
		} catch (error) {
			res.status(412).json(error);
			this.logger.error(error.msg, error);
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
  
      let foundUser = await User.findOne({ email: email });
      if (foundUser) {
        const error = { code: 403, msg: 'Email is already in use' }
        throw error;
      }
      const newUser: IUser = new User({
        email,
        localProvider: {
          password: hash
        },
        role
      });
  
      const user: IUser = await newUser.save();
  
      const token = this.authService.createToken(user);
      return res.status(200).json({
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
          email: user.email,
          token: `${token}`,
          strategy: 'local',
          role: user.role,
          avatar: user.profile.avatar,
        });
      },
    )(req, res, next);
  };

  public verifyJwt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    if (req.params.token) {
      try {
        const token = req.params.token;
        const decoded = this.authService.verifyToken(token);
        if (!decoded.verified) {
          throw decoded;
        }
        return res.status(200).send(decoded);
      } catch (error) {
        if (!error.verified) {
          return res.status(500).send(error);
        }
        this.logger.error('Error when verifying token', error);
        return res.status(500).send({ verified: false });
      }
    }
    return res.status(500).send({ verified: false });
  }
}

export default UserController;