import { default as dotenv } from 'dotenv';

import {
  IConfig,
  Environment,
  IServerConfig,
  ServerProtocol,
} from './config.types';

class Config implements IConfig {
  public docs: boolean;
  public env: Environment;
  public server: IServerConfig;
  public mongoDBConnection: string;

  constructor() {
    dotenv.config();
    this.loadEnvironmentVariables();
  }

  private loadEnvironmentVariables(): void {
    this.docs = Boolean(process.env.NODE_DOCS || false);
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
    this.mongoDBConnection = process.env.MONGODB_CONNECTION;
  }
}

export default Config;
