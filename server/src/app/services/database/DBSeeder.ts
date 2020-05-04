import { default as faker } from 'faker';
import bcrypt from 'bcrypt';

import { ILogger } from '../logger';
import { IConfig } from '../../services';
import { UserModel, IUser } from '../../models/mongoose';

export interface IDBSeeder {
	createAdmin(): Promise<void>;
	createUsers(  amount:number ): Promise<void>;
	createTestUser(): Promise<void>;
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
		} catch (error) {
			this.logger.error('Error while creating admin.', error);
		}
	}

	public async createTestUser (): Promise<void> {
		const email = 'test@test.com';
		const password = 'test';
		const role = 'user';
		const profilePictureName = '372cc2c3e1ebf024444fd2cf6168473a.jpg';
		try {
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
				profile: {
					profilePictureName,
				}
			});

			await admin.save();
			this.logger.info(`Created test user account`, {});
		} catch (error) {
			this.logger.error('Error while creating test user.', error);
		}
	}

	public async createUsers (amount: number): Promise<void> {
		const profilePictures = ['8bf0ecc14a1e42a8ec03764a42d057e4.jpg','719bf847e80e849587082a12a0686020.jpg','2212a2ce096ac911698f4bfe1d93a1c4.jpg','0c9d4c986a42c3fbb2e299c0921b3517.jpg','c1f6094f370f13e08f14a73081e21ee7.jpg','cdec35132b1f54bec013ae2de375a2bc.jpg'];
		for (let i = 0; i < amount; i++) {
			const email = `${faker.name.findName().replace(' ', '.')}@gmail.com`;
			const username = faker.name.findName();
			const profileDescription = faker.lorem.sentences(2);
			const profilePictureName = profilePictures[i];
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
						profilePictureName,
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
