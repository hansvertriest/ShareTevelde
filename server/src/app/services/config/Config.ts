import { default as dotenv } from 'dotenv';

import {
  IConfig,
  Environment,
  IServerConfig,
  ServerProtocol,
  IAuthConfig,
  IAdminCreds,
  IGoogleConfig,
} from './config.types';

class Config implements IConfig {
  public docs: boolean;
  public env: Environment;
  public server: IServerConfig;
  public mongoDBConnection: string;
  public auth: IAuthConfig;
  public google: IGoogleConfig;
  public adminCreds: IAdminCreds;
  public jwt_secret: string;

  constructor() {
    dotenv.config();
    this.loadEnvironmentVariables();
  }

  private loadEnvironmentVariables(): void {
    // docs config
    this.docs = Boolean(process.env.NODE_DOCS || false);

    // environment config
    this.env =
      Environment[
        (process.env.NODE_ENV ||
          Environment.development) as keyof typeof Environment
      ];
    this.server = {
      host: process.env.NODE_SERVER_HOST || 'localhost',
      port: Number(process.env.NODE_SERVER_PORT || 8080),
      protocol:
        ServerProtocol[
          (process.env.NODE_SERVER_PROTOCOL ||
            ServerProtocol.http) as keyof typeof ServerProtocol
        ],
    } as IServerConfig;

    // mongo config
    this.mongoDBConnection = process.env.MONGODB_CONNECTION;

    // auth config
    this.auth = {
      bcryptSalt: Number(process.env.AUTH_BCRYPT_SALT || 10),
      jwt: {
        secret: process.env.AUTH_JWT_SECRET || 'share_secret_Tevelde',
        session: Boolean(process.env.AUTH_JWT_SESSION || true),
	  },
	  jwt_expiresIn: parseInt(process.env.JWT_EXPIRESIN),
      facebook: {
        clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET,
      },
	};

	//google config
	this.google = {
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_SECRET,
	}
	//admin credentials
	this.adminCreds = {
		email: process.env.ADMIN_EMAIL,
		pass: process.env.ADMIN_PASS,
	}
  }
}

export default Config;
