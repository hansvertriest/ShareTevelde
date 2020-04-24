import { default as mongoose, Document, Schema, SchemaTypes } from 'mongoose';
// import beautifyUnique from 'mongoose-beautiful-unique-validation';

import authService from '../../services/auth';


import { ICourse } from '.';

interface IAssignment extends Document {
	title: string;
	courseId : ICourse['_id'];
	description: string;
}

const assignmentSchema: Schema = new Schema({
	title: { type: String, required: true, unique: true, max: 20 },
	description: { type: String, required: false, max: 40 },
	courseId: {
		type: Schema.Types.ObjectId,
		ref: 'course',
		required: true,
	}
});

// assignmentSchema.plugin(beautifyUnique);


const AssignmentModel = mongoose.model<IAssignment>('Assignment', assignmentSchema);

const AssignmentModelKeys = Object.keys(assignmentSchema.paths);


export { IAssignment, AssignmentModel, assignmentSchema, AssignmentModelKeys };