export enum Environment {
  development = 'development',
  production = 'production',
  test = 'test',
}

export enum ServerProtocol {
  http = 'http',
  https = 'https',
}

export interface IServerConfig {
  host: string;
  port: number;
  protocol: string;
}

export interface IConfig {
  env: Environment;
  docs: boolean;
  server: IServerConfig;
  mongoDBConnection: string;
}
