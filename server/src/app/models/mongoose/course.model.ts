import { default as mongoose, Document, Schema } from 'mongoose';


interface ICourse extends Document {
	courseTitle: string;
	year: number;
	direction: string;
	schoolyear: string;
	softDeleted: boolean;
}

const courseSchema: Schema = new Schema({
	courseTitle : { type: String, required: true, unique: true, max: 30 },
	year : { type: Number, required: true },
	direction : { type: String, required: true },
	schoolyear: { type : String, required: true },
	softDeleted: { type: Boolean, default: false},
});


const CourseModel = mongoose.model<ICourse>('course', courseSchema);

const CourseModelKeys = Object.keys(courseSchema.paths);

export { courseSchema, CourseModel, ICourse, CourseModelKeys };