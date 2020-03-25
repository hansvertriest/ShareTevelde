import { default as mongoose, Document, Schema } from 'mongoose';

interface IMessage extends Document {
  body: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
}

const messageSchema: Schema = new Schema({
  body: { type: String, required: true, unique: false, max: 2056 },
  _createdAt: { type: Number, required: true, default: Date.now() },
  _modifiedAt: { type: Number, required: false, default: null },
  _deletedAt: { type: Number, required: false, default: null },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

// interface IUser extends Document {
//   userId: string;
//   userName: string;
//   profileDescription: string;
//   postIds: string[];
//   profilePictureUrl: string;
//   linkFb: string;
//   linkInsta: string;
//   linkTwitter: string;
// }

// const userSchema: Schema = new Schema({
//   userId: {type: String},
//   userName: {type: String},
//   profileDescription: {type: String},
//   postIds: {type: [String]},
//   profilePictureUrl: {type: String},
//   linkFb: {type: String},
//   linkInsta: {type: String},
//   linkTwitter: {type: String},
// })

export { IMessage, Message, messageSchema };
// export {  }
