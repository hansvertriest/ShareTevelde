import { default as React, useState, useEffect } from 'react';

import { Menu } from '../components/menu';
import { useAuth, useApi } from '../services';
import { PageTitle, Subtitle, H2 } from '../components/typography';
import './Course.scss';

const Course = (props) => {
	const { currentUser } = useAuth();
	const { getcourseById, getAssignmentsOfCourse } = useApi();

	const [data, setData] = useState(undefined);
	const [assignments, setAssignments] = useState([])
	

	useEffect(() => {
		const func = async () => {
			// fetch course
			const getCourse = await getcourseById(props.match.params[0]);
			if (getCourse.courseTitle) {
				setData(getCourse);
				// create assignments
				const getAssignments = await getAssignmentsOfCourse(props.match.params[0]);
				if (getAssignments.length > 0) {
					const assignmentElements = getAssignments.map((assignment) => {
						return(
							<div className="assignment-list-item" key={assignment._id}>
								<a href={`/assignment/${assignment._id}`}><H2>{assignment.title}</H2></a>
							</div>
						);
					});
					setAssignments(assignmentElements);
				}
			} else {
				window.location.href = '/notfound';
			}
		}
		func();
	}, []);
	
	return (
		<div className="page__course">
			 <div className="aside-container aside-container--top">
				{
					(currentUser)
					? <Menu id="menu-top"/>
					: null
				}
				
			</div>
			<div className="course-container">
				{
					(data)
					? <div className="course-container__header">
					<PageTitle>{data.courseTitle}</PageTitle><Subtitle>Klas: {data.direction}</Subtitle>
					</div>
					: undefined
				}
				{assignments}
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

export default Course;