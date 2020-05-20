import { Request, Response, NextFunction } from 'express';
import { default as passport, PassportStatic } from 'passport';
import { default as passportLocal } from 'passport-local';
import { default as passportJwt } from 'passport-jwt';
// import { default as GoogleStrategy } from 'passport-google-oauth20';
var GoogleStrategy = require('passport-google-oauth20').Strategy;
import { default as jwt } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Environment, IConfig } from '../config';
import { IUser, UserModel, userSchema } from '../../models/mongoose';
import { Role, IVerifiedToken } from './auth.types';
import { UnauthorizedError, ForbiddenError } from '../../utilities';

class AuthService {
  private config: IConfig;
  public passport: PassportStatic;
  private LocalStrategy = passportLocal.Strategy;
  private ExtractJwt = passportJwt.ExtractJwt;
  private JwtStrategy = passportJwt.Strategy;

  constructor(config: IConfig) {
	this.config = config;
	
    this.initializeLocalStrategy();
	this.initializeJwtStrategy();
	this.initializeGoogleStrategy();
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    this.passport = passport;
  }

  private initializeLocalStrategy() {
    passport.use(
      new this.LocalStrategy(
        {
          usernameField: 'email',
        },
        async (email: string, password: string, done) => {
          try {
            const user = await UserModel.findOne({
              email: email,
            });

            if (!user) {
              return done(null, false, { message: 'No user by that email' });
            }

            return user.comparePassword(password, (err: any, isMatch: boolean) => {
              if (!isMatch) {
                return done(null, false);
              }
              return done(null, user);
            });
          } catch (error) {
            return done(error, false);
          }
        },
      ),
    );
  }

  initializeGoogleStrategy = () => {
	passport.use(new GoogleStrategy({
		clientID: this.config.google.clientId,
		clientSecret: this.config.google.clientSecret,
		callbackURL: "http://localhost:3000/auth/google/callback"
	  },
	  function(accessToken, refreshToken, data, profile, cb) {
		// userSchema.findOrCreate(profile.email, profile.id function (err, user) {
		//   return cb(err, user);
		// });
		const profileJson = profile._json;
		UserModel.findOne({email: profileJson.email}).exec()
		.then((response: IUser) => {
			// if exists return response else create the user
			if (response) {
				if (response.googleProvider.googleId) {
					return cb(null, response)
				} else {
					response.update({
						profile: {
							username: profileJson.name.replace(' ', '_')
						},
						googleProvider: {
							googleId: profile.id,
							pictureUrl: profileJson.picture,
						},
					}).exec()
						.then((response) => {
							return cb(null, response);
						})
						.catch((err) => {
							return cb(err, false)
						});
				}
			} else {
				const newUser: IUser = new UserModel({
					email: profileJson.email,
					profile: {
						username: profileJson.name.replace(' ', '_')
					},
					googleProvider: {
						googleId: profile.id,
						pictureUrl: profileJson.picture,
					},
					role: 'user'
				});

				newUser.save()
					.then((response) => {
						return cb(null, response);
					})
					.catch((err) => {
						return cb(err, false)
					});
			}
		});
	  }
	));
  }

  initializeJwtStrategy = () => {
    passport.use(
      new this.JwtStrategy(
        {
          secretOrKey: this.config.auth.jwt.secret,
          jwtFromRequest: this.ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (jwtPayload, done) => {
          try {
            const { id } = jwtPayload;

            const user = await UserModel.findById(id);
            if (!user) {
              return done(null, false);
            }

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        },
      ),
    );
  };

  public createToken(user: IUser, expiresIn: number|undefined = undefined ): string {
    const payload = {
		profile: user.profile,
		id: user._id,
		role: user.role,
    };
    return jwt.sign(payload, this.config.auth.jwt.secret, {
      expiresIn: (expiresIn) ? expiresIn : this.config.auth.jwt_expiresIn,
    });
  }

  public checkIsInRole = (...roles: Array<string>) => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      next(new ForbiddenError());
    }

    const hasRole = roles.find(role => (req.user as IUser).role === role);
    if (!hasRole) {
      next(new UnauthorizedError());
    }

    return next();
  };

  public encrypt = async (string: string) : Promise<any> => {
    return bcrypt.hash(string, this.config.auth.bcryptSalt);
  }

  public verifyToken = (token:string): IVerifiedToken => {
    try {
	  const decoded: string | object = jwt.verify(token, this.config.auth.jwt.secret);
      if (!decoded) {
        const error = { msg: 'Couldn\'t decode the token!' }
        throw error;
      }
      if (decoded.exp > Date.now()) {
        const error = { msg: 'Token is expired!' }
        throw error;
      }
      return {
        verified: true,
		id: decoded.id,
		exp: decoded.exp,
        role: decoded.role,
      };
    } catch (error) {
      if (error.msg) {
        return {
          verified: false,
          id: undefined,
          role: undefined,
          error,
        };
      }
      return {
        verified: false,
        id: undefined,
        role: undefined,
        unknownError: error,
      };
    }
  }


}

export default AuthService;
