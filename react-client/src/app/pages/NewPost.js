import { default as React, useState, useEffect, Fragment } from 'react';

import { useApi, useAuth } from '../services';
import { Menu } from '../components/menu';
import { PageTitle, Label } from '../components/typography';
import { InputFieldTextWithResults, InputFieldText, UploadPicture } from '../components/formComponents';

// import { ProfilePicture, SocialMediaField } from '../components/formComponents';

import './NewPost.scss';

const NewPost = ({children}) => {
	const { getCourses, getAssignments, createNewCourse, createNewAssignment } = useApi();
	const { currentUser } = useAuth();

	const [courseId, setCourseId] = useState(undefined);
	const [assignmentId, setAssignmentId] = useState(undefined);
	
	const [pictures, setPictures] = useState([<UploadPicture key="0" index="0"/>]);

	// searchCourse
	const searchCourse = async (input) => {
		const courses = await getCourses({'courseTitle:like': [input]} );
		const courseElements = (courses.length > 0) 
			? courses.map((course) => {
				return (
					<div 
						className="form-search-results__option" 
						key={course._id} 
						onClick={
							() => {
								// set input
								document.getElementById('course-input').value = course.courseTitle;
								// remove search results
								document.querySelector('.assignment-section__course .form-search-results').classList.remove('form-search-results--show');
								// enalbe second input field
								document.querySelector('.assignment-section__assignment').classList.remove('assignment-section__assignment--disabled');
								// hide crerate form
								document.querySelector('.assignment-section__course .course-input-create-form').classList.remove('course-input-create-form--show');
								// save id for form submission
								setCourseId(course._id);
							}
							}
					>
						<p className="option__title">{course.courseTitle} </p>
						<p className="option__info"><strong>{course.direction}</strong> | {course.schoolyear}</p>
					</div>
				)
			})
			: [];
		return(courseElements);
	}

	// searchCourse
	const searchAssignment = async (input) => {
		const filter = {};
		if (input) filter['title:like'] = [input];
		if (courseId) filter['courseId'] = [courseId];
		const assignments = await getAssignments(filter);
		const asignmentElements = (assignments.length > 0) 
			? assignments.map((assignment) => {
				return (
					<div 
						className="form-search-results__option" 
						key={assignment._id} 
						onClick={
							() => {
								// set input
								document.getElementById('assignment-input').value = assignment.title;
								// remove search results
								document.querySelector('.assignment-section__assignment .form-search-results').classList.remove('form-search-results--show');
								// save id for form submission
								// hide crerate form
								document.querySelector('.assignment-section__assignment .assignment-input-create-form').classList.remove('assignment-input-create-form--show');
								setAssignmentId(assignment._id);
							}}
					>
						<p className="option__title">{assignment.title} </p>
					</div>
				)
			})
			: [];
		return(asignmentElements);
	}

	// create new course
	const createCourse = async () => {
		const name = document.getElementById('course-input-create-form__name').value;
		console.log(name);
		const schoolyear = document.getElementById('course-input-create-form__schoolyear').value;
		const direction = document.getElementById('course-input-create-form__direction').value;

		const course = await createNewCourse(name, schoolyear, direction);
		if (course._id) {
			setCourseId(course._id);
			return course;
		}
		return undefined;
	}

	// create new course
	const createAssignment = async () => {
		const title = document.getElementById('assignment-input-create-form__title').value;
		const description = document.getElementById('assignment-input-create-form__description').value;

		const assignment = await createNewAssignment(courseId, title, description);
		if (assignment._id) {
			setAssignmentId(assignment._id);
			return assignment;
		}
		return undefined;
	}



	return (
		<div className="page__new-post">
			<div className="aside-container aside-container--top">
				{
					(currentUser)
					? <Menu id="menu-top"/>
					: null
				}
			</div>
			<div className="post-form-container">
				<PageTitle>Nieuwe Post</PageTitle>
				<form>
					<div className="post-form-container__assignment-section">
						<div className="assignment-section__course">
							<InputFieldTextWithResults 
								label="Opleidingsonderdeel"
								id="course-input" 
								name="course" 
								placeholder="Zoek een vak..."
								fetchResults={searchCourse}
								searchingMessage="Opzoek naar vakken"
								onCreate={createCourse}
								title="courseTitle"
								onComplete={() => {
									document.querySelector('.assignment-section__assignment').classList.remove('assignment-section__assignment--disabled');
								}}
								form={
									<Fragment>
										<input id={`course-input-create-form__name`} placeholder="Naam" autoComplete="off"/>
										<select id={`course-input-create-form__schoolyear`} placeholder="Academiejaar" autoComplete="off"> 
											<option value="2019-2020">2019-2020</option>
											<option value="2020-2021">2020-2021</option>
										</select>
										<select id={`course-input-create-form__direction`} placeholder="Klas" autoComplete="off"> 
											<option value="1GDM">1GDM</option>
											<option value="2CMO">2CMO</option>
											<option value="3CMO">3CMO</option>
											<option value="2NMD">2NMD</option>
											<option value="3NMD">3NMD</option>
											<option value="2AVD">2AVD</option>
											<option value="3AVD">3AVD</option>
											<option value="2GMB">2GMB</option>
											<option value="3GMB">3GMB</option>
										</select>
									</Fragment>
								}
							/>
						</div>
						
						<div className="assignment-section__assignment assignment-section__assignment--disabled">
							<InputFieldTextWithResults 
								label="Opdracht"
								id="assignment-input" 
								name="assignment" 
								placeholder="Zoek een opdracht..."
								fetchResults={searchAssignment}
								searchingMessage="Opzoek naar opdrachten"
								onCreate={createAssignment}
								title="title"
								onComplete={() => {}}
								form={
									<Fragment>
										<input id={`assignment-input-create-form__title`} placeholder="Naam" autoComplete="off"/>
										<input id={`assignment-input-create-form__description`} placeholder="Omschrijving" autoComplete="off"/>										
									</Fragment>
								}
							/>
						</div>
					</div>
					<div className="post-form-container__url-section">
						<Label>Link naar volledig project</Label>
						<InputFieldText
							placeholder="https:// ... "
						/>
					</div>
					<div className="post-form-container__pictures-section">
						<Label>Foto's</Label>
						
						{pictures}

					</div>
				</form>
			</div>
			<div className="aside-container aside-container--right">
				{
					(currentUser)
					? <Menu id="menu-right"/>
					: null
				}
			</div>
		</div>
	);
};

export default NewPost;