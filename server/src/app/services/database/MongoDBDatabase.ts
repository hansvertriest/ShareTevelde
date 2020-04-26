import { default as mongoose, Connection } from 'mongoose';
import { default as faker } from 'faker';

import { ILogger } from '../logger';
import { IConfig } from '../config';
import { IMessage, Message, IUser, UserModel, ICourse, CourseModel } from '../../models/mongoose';

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

  private UserCreate = async (
    userName: string,
    profileDescription: string,
    postIds: string[],
    profilePictureName: string,
    linkFb: string,
    linkInsta: string,
    linkTwitter: string,
  ) => {
    const user = new UserModel({
      userName,
      profileDescription,
      postIds,
      profilePictureName,
      linkFb,
      linkInsta,
      linkTwitter,
    });
    try {
      const newUser = await user.save();
      this.logger.info(`Message created with id ${newUser._id}`, {});
    } catch (error) {
      this.logger.error('An error occurred when creating a message', error);
    }

  }

  private createUsers = async () => {
    new Promise( async () => this.UserCreate(
        faker.name.findName(),
        faker.lorem.sentences(4),
        [],
        '02125be7bc1e82fdf7a34ba12b9f9063.jpg',
        'https://www.facebook.com/jana.vanderborgt',
        'https://twitter.com/lena_vdb',
        'https://www.instagram.com/melina_torres_924/',
      )
    )
  }

  // private courseCreate = async (
  //   courseTitle: string,
  //   year: Date,
  //   direction: string,
  //   schoolyear: string,
  // ) : Promise<void> => {
  //   const course = new CourseModel({
  //     courseTitle,
  //     year,
  //     direction,
  //     schoolyear,
  //   })
  //   try {
  //     const newUser = await course.save();
  //     this.logger.info(`Course created with id ${newUser._id}`, {});
  //   } catch (error) {
  //     this.logger.error('An error occurred when creating a course', error);
  //   }
  // }

  // private createCourses= async () => {

  // }


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
    // const messages = await Message.estimatedDocumentCount()
    //   .exec()
    //   .then(async (count) => {
    //     if (count === 0) {
    //       await this.createMessages();
    //     }
    //   });
    // const users = await UserModel.estimatedDocumentCount()
    //   .exec()
    //   .then(async (count) => {
    //     if (count === 0 ) {
    //       await this.createUsers();
    //     }
    //   })
  };
}

export default MongoDBDatabase;
