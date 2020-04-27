import { default as faker } from 'faker';
import bcrypt from 'bcrypt';

import { ILogger } from '../logger';
import { IConfig } from '../../services';
import { UserModel, IUser } from '../../models/mongoose';

export interface IDBSeeder {
	createAdmin(): Promise<void>;
	createUsers(  amount:number ): Promise<void>;
}

export class DBSeeder implements IDBSeeder {
	private config: IConfig;
	private logger: ILogger;
  
	constructor(logger: ILogger, config: IConfig) {
	  this.logger = logger;
	  this.config = config;
	}

	public async createAdmin (): Promise<void> {
		const email = 'admin@admin.com';
		const password = this.config.adminCreds.pass;
		const role = 'administrator';
		try {
			const users: IUser[] = await UserModel.find({role: 'admin'}).exec();

			if (users.length === 0) {
				const hash = await bcrypt.hash(password, this.config.auth.bcryptSalt)
					.catch(() =>{
						const error = { code: 500, msg: 'failed to encrypt password' }
						throw error;
					})

				const admin: IUser = new UserModel({
					email,
					localProvider: {
						password: hash
					},
					role,
				});

				await admin.save();
				this.logger.info(`Created admin account`, {});
			}
		} catch (error) {
			this.logger.error('Error while creating admin.', error);
		}
	}

	public async createUsers (amount: number): Promise<void> {
		for (let i = 0; i < amount; i++) {
			const email = `${faker.name.findName().replace(' ', '.')}@gmail.com`;
			const username = faker.name.findName();
			const profileDescription = faker.lorem.sentences(2);
			const password = 'test';
			const role = 'user';
			const linkFb = 'https://www.facebook.com/jana.vanderborgt';
			const linkInsta = 'https://www.instagram.com/melina_torres_924/';
			const linkTwitter = 'https://twitter.com/lena_vdb';
			try {
				const hash = await bcrypt.hash(password, this.config.auth.bcryptSalt)
					.catch(() =>{
						const error = { code: 500, msg: 'failed to encrypt password' }
						throw error;
					})

				const user: IUser = new UserModel({
					email,
					localProvider: {
						password: hash
					},
					role,
					profile: {
						username,
						profileDescription,
						profilePictureName: 'dc11cd2e8278a53e6d26fae67f9326db.jpg',
						linkFb,
						linkInsta,
						linkTwitter,
					}
				});

				await user.save();
				this.logger.info(`Created ${amount} accounts`, {});
			} catch (error) {
				this.logger.error('Error while creating user.', error);
			}
		}
	}
}
