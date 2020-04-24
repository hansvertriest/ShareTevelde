import { default as mongoose, Document, Schema } from 'mongoose';
import { default as bcrypt } from 'bcrypt';

interface ILocalProvider {
  password: string;
}

interface IProfile {
  username: string;
  profileDescription: string;
  profilePictureName: string;
  linkFb: string;
  linkInsta: string;
	linkTwitter: string;
  linkYt: string;
  linkVimeo: string;
}

interface IUser extends Document {
  email: string;

  localProvider? : ILocalProvider;

  role: string;
  profile?: IProfile;
  
	_createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  comparePassword(candidatePassword: String, cb: Function): void;
}

const userSchema: Schema = new Schema({
  softDeleted: { type: Boolean, default: false},
  email: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
	_createdAt: { type: Number, required: true, default: Date.now() },
  _modifiedAt: { type: Number, required: false, default: null },
  _deletedAt: { type: Number, required: false, default: null },
  localProvider: {
    password: {
      type: String,
      required: false,
    },
  },
  profile: {
    username: {type: String},
    profileDescription: {type: String},
    profilePictureName: {type: String},
    // signupEmailPassword: ,
    linkFb: {type: String},
    linkInsta: {type: String},
    linkTwitter: {type: String},
    linkYt: {type: String},
    linkVimeo: {type: String},
  },
  role: {
    type: String,
    enum: ['user', 'administrator'],
    default: 'user',
    required: true,
    immutable: true,
  },
})

userSchema.methods.comparePassword = function( candidatePassword: String, cb: Function ) {
  const user = this;
  bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    if (err) return cb(err, null);
    return cb(null, isMatch);
  });
};



const UserModel = mongoose.model<IUser>('User', userSchema);

const UserModelProperties = Object.keys(userSchema.paths);
const userForbiddenFilters = ['role','softDeleted', 'email'];

export { IUser, IProfile, UserModel, userSchema, UserModelProperties, userForbiddenFilters };