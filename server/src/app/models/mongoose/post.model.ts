import {
	default as mongoose,
	Document,
	Schema,
	PaginateModel
} from 'mongoose';

import { default as paginate } from 'mongoose-paginate';

import {
	IAssignment
} from './assignment.model';
import {
	IPicture
} from './picture.model';
import {
	IUser
} from './user.model';


interface ILike {
	user: IUser['_id'];
	_createdAt: number;
}

interface IAgree {
	user: IUser['_id'];
	_createdAt: number;
}

interface IFeedback {
	user: IUser['_id'];
	content: string;
	agrees: IAgree[];
	_createdAt: number;
}

interface IPost extends Document {
	assignment: IAssignment['_id'];
	urlToProject: string;
	pictures: IPicture['_id'][];
	user: IUser['_id'];
	likes: ILike[];
	feedback: IFeedback[];
	softDeleted: boolean;
}

const postSchema: Schema = new Schema({
	assignment: {
		type: Schema.Types.ObjectId,
		ref: 'Assignment',
		required: true,
	},
	urlToProject: {
		type: String
	},
	pictures: [{
		type: Schema.Types.ObjectId,
		ref: 'Picture',
		required: true,
	}],

	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		immutable: true,
	},

	likes: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			immutable: true,
		},
		_createdAt: {
			type: Number,
			required: true,
			default: () => { return new Date() }
		},
	}],

	feedback: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			immutable: true,
		},
		content: {
			type: String,
			required: true,
			max: 200,
		},
		agrees: [{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
				immutable: true,
			},
			_createdAt: {
				type: Number,
				required: true,
				default: () => { return new Date() }
			},
		}],
		_createdAt: {
			type: Number,
			required: true,
			default: () => { return new Date() }
		},
	}],

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
	softDeleted: {
		type: Boolean,
		default: false
	},
});

postSchema.plugin(paginate);
const PostModel = mongoose.model < IPost > ('post', postSchema);

// const AssignmentModelKeys = Object.keys(assignmentSchema.paths);


export {
	IPost,
	PostModel,
	postSchema,
	IAssignment,
	IPicture,
	IUser,
	ILike,
	IFeedback,
	IAgree,
};