import { default as mongoose, Connection } from 'mongoose';

import { ILogger } from '../logger';
import { IConfig } from '../config';
import { IUser, UserModel } from '../../models/mongoose';

import { DBSeeder, IDBSeeder } from './DBSeeder';

class MongoDBDatabase {
  private config: IConfig;
  private logger: ILogger;
  private seeder: IDBSeeder;
  public db: Connection; 

  constructor(logger: ILogger, config: IConfig) {
    this.logger = logger;
	this.config = config;
	this.seeder = new DBSeeder(this.logger, this.config);
  }

  public connect(): Promise<any> {


    return new Promise<any>((resolve, reject) => {
      mongoose
        .connect(this.config.mongoDBConnection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(data => {
          this.db = mongoose.connection;

          this.logger.info('Connected to the mongodb database', {});

          resolve(true);
        })
        .catch(error => {
          this.logger.error("Can't connect to the database", error);

          reject(error);
        });
    });
  }

  public disconnect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db
        .close(true)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          this.logger.error("Can't disconnect the database", error);

          reject(error);
        });
    });
  }
  
  public seed = async () => {
	// get all users 
	const users: IUser[] = await UserModel.find().exec();

	if (users.filter((user) => user.role === 'administrator').length === 0) {
		this.seeder.createAdmin();
	}
	if (users.filter((user) => user.role === 'user').length === 0) {
		this.seeder.createUsers(10);
	}	
  };
}

export default MongoDBDatabase;
