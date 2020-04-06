import { default as mongoose, Document, Schema, SchemaTypes } from 'mongoose';

import { ICourse } from '.';

interface IAssignment extends Document {
	assignmentTitle: string;
	courseId : ICourse['_id']
}

const assignmentSchema: Schema = new Schema({
	assignmentTitle: { type: String, required: true, max: 20 },
	_courseId: {
		type: Schema.Types.ObjectId,
		ref: 'course',
		required: true,
	}
});

const AssignmentModel = mongoose.model<IAssignment>('assignment', assignmentSchema);

const AssignmentModelKeys = Object.keys(assignmentSchema.paths);

export { IAssignment, AssignmentModel, assignmentSchema, AssignmentModelKeys };