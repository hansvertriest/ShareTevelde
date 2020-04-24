import { default as mongoose, Document, Schema } from 'mongoose';

interface IPicture extends Document {
  title: string;
  description: string;
  filename: string;
  _createdAt: number;
}

const pictureSchema: Schema = new Schema({
  title: {
    type: String,
    required: false,
    unique: false,
    max: 60,
  },
  description: {
    type: String,
    required: false,
    unique: false,
    max: 600,
  },
  filename: {
		type: String,
		required: true,
	},
  _createdAt: { type: Number, required: true, default: Date.now() },
});

const PictureModel = mongoose.model<IPicture>('Picture', pictureSchema);

export { PictureModel, IPicture, pictureSchema };
