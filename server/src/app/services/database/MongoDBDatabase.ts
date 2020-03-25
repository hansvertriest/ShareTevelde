import { default as mongoose, Connection } from 'mongoose';
import { default as faker } from 'faker';

import { ILogger } from '../logger';
import { IConfig } from '../config';
import { IMessage, Message } from '../../models/mongoose';

class MongoDBDatabase {
  private config: IConfig;
  private logger: ILogger;
  public db: Connection;

  constructor(logger: ILogger, config: IConfig) {
    this.logger = logger;
    this.config = config;
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

  private messageCreate = async (body: string) => {
    const message = new Message({ body });

    try {
      const newMessage = await message.save();

      this.logger.info(`Message created with id ${newMessage._id}`, {});
    } catch (error) {
      this.logger.error('An error occurred when creating a message', error);
    }
  };

  private createMessages = async () => {
    await Promise.all([
      (async () => this.messageCreate(faker.lorem.paragraph()))(),
      (async () => this.messageCreate(faker.lorem.paragraph()))(),
      (async () => this.messageCreate(faker.lorem.paragraph()))(),
      (async () => this.messageCreate(faker.lorem.paragraph()))(),
      (async () => this.messageCreate(faker.lorem.paragraph()))(),
      (async () => this.messageCreate(faker.lorem.paragraph()))(),
      (async () => this.messageCreate(faker.lorem.paragraph()))(),
      (async () => this.messageCreate(faker.lorem.paragraph()))(),
      (async () => this.messageCreate(faker.lorem.paragraph()))(),
    ]);
  };

  public seed = async () => {
    const messages = await Message.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createMessages();
        }
        return Message.find().exec();
      });
  };
}

export default MongoDBDatabase;
