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

export { IMessage, Message, messageSchema };
