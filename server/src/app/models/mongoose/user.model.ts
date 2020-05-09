import {
	default as mongoose,
	Document,
	Schema
} from 'mongoose';
import {
	default as bcrypt
} from 'bcrypt';

interface ILocalProvider {
	password: string;
}

enum NotificationType {
	Info = 'info',
	Agree = 'agree',
	Like = 'like',
	Comment = 'comment'
}

interface INotification {
	content: string;
	destinationUrl: string;
	senderUser: IUser['_id'];
	type: NotificationType;
	_createdAt: number;
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

	localProvider ? : ILocalProvider;

	role: string;
	profile ? : IProfile;
	notifications: INotification[];

	_createdAt: number;
	_modifiedAt: number;
	_deletedAt: number;

	comparePassword(candidatePassword: String, cb: Function): void;
}

const userSchema: Schema = new Schema({
	softDeleted: {
		type: Boolean,
		default: false
	},
	email: {
		type: String,
		required: true,
		unique: true,
		immutable: true,
	},
	_createdAt: {
		type: Number,
		required: true,
		default: () => { return new Date() }
	},
	_modifiedAt: {
		type: Number,
		required: false,
		default: null
	},
	_deletedAt: {
		type: Number,
		required: false,
		default: null
	},
	localProvider: {
		password: {
			type: String,
			required: false,
		},
	},
	profile: {
		username: {
			type: String,
			max: 15,
		},
		profileDescription: {
			type: String,
			max: 200,
		},
		profilePictureName: {
			type: String
		},
		// signupEmailPassword: ,
		linkFb: {
			type: String
		},
		linkInsta: {
			type: String
		},
		linkTwitter: {
			type: String
		},
		linkYt: {
			type: String
		},
		linkVimeo: {
			type: String
		},
	},
	notifications: [{
		content: {
			type: String,
			max: 100,
			required: true,
		},
		destinationToUrl: {
			type: String,
		},
		senderUser: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum : ['info','agree', 'comment', 'like'],
			default: 'info',
			required: true,
		},
		_createdAt: {
			type: Number,
			required: true,
			default: () => { return new Date() }
		},
	}],
	role: {
		type: String,
		enum: ['user', 'administrator'],
		default: 'user',
		required: true,
		immutable: true,
	},
})

userSchema.methods.comparePassword = function(candidatePassword: String, cb: Function) {
	const user = this;
	bcrypt.compare(candidatePassword, user.localProvider.password, (err, isMatch) => {
		if (err) return cb(err, null);
		return cb(null, isMatch);
	});
};

const UserModel = mongoose.model < IUser > ('User', userSchema);

const UserModelProperties = Object.keys(userSchema.paths);
const userForbiddenFilters = ['role', 'softDeleted', 'email'];

export {
	IUser,
	IProfile,
	INotification,
	NotificationType,
	UserModel,
	userSchema,
	UserModelProperties,
	userForbiddenFilters
};