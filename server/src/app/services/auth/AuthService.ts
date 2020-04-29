import { Request, Response, NextFunction } from 'express';
import { default as passport, PassportStatic } from 'passport';
import { default as passportLocal } from 'passport-local';
import { default as passportJwt } from 'passport-jwt';
import { default as jwt } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Environment, IConfig } from '../config';
import { IUser, UserModel } from '../../models/mongoose';
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

  public createToken(user: IUser): string {
    const payload = {
		profile: user.profile,
		id: user._id,
		role: user.role,
    };
    return jwt.sign(payload, this.config.auth.jwt.secret, {
      expiresIn: 60 * 120,
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
