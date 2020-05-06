import { default as React, useState, useEffect } from 'react';

import { useApi, useAuth } from '../services';
import { Menu } from '../components/menu';
import { PageTitle } from '../components/typography';
import { InputFieldTextWithResults } from '../components/formComponents'
import { apiConfig } from '../config';

// import { ProfilePicture, SocialMediaField } from '../components/formComponents';

import './NewPost.scss';

const NewPost = ({children}) => {
	const { getCourses, getAssignments } = useApi();
	const { currentUser } = useAuth();

	const [courseId, setCourseId] = useState(undefined);
	const [assignmentId, setAssignmentId] = useState(undefined);

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
								document.getElementById('course-input').value = course.courseTitle;
								document.querySelector('.assignment-section__course .search-results').classList.remove('search-results--show');
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
			console.log(assignments);
			const asignmentElements = (assignments.length > 0) 
				? assignments.map((assignment) => {
					return (
						<div 
							className="form-search-results__option" 
							key={assignment._id} 
							onClick={
								() => {
									document.getElementById('assignment-input').value = assignment.title;
									document.querySelector('.assignment-section__assignment .search-results').classList.remove('search-results--show');
									// save id for form submission
									setAssignmentId(assignment._id);
								}
								}
						>
							<p className="option__title">{assignment.title} </p>
						</div>
					)
				})
				: [];
			return(asignmentElements);
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
							/>
						</div>
						
						<div className="assignment-section__assignment">
							<InputFieldTextWithResults 
								label="Opdracht"
								id="assignment-input" 
								name="assignment" 
								placeholder="Zoek een opdracht..."
								fetchResults={searchAssignment}
								searchingMessage="Opzoek naar opdrachten"
							/>
						</div>
					</div>
					<div className="post-form-container__url-section">

					</div>
					<div className="post-form-container__pictures-section">

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