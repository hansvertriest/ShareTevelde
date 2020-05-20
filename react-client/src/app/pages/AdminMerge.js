import { default as React, useState, useEffect, Fragment } from 'react';


import './AdminMerge.scss';
import { useApi } from '../services';
import { PageTitle } from '../components/typography';

const AdminMerge = (props) => {
	const { mergeAssignments, getCoursesAndSoftdeleted, getAssignmentsAndSoftDeleted, mergeCourses } = useApi();

	const [tableName, setTableName] = useState('course');
	const [listItems, setListItems] = useState([]);

	const selectItem = (ev) => {
		// ev.target.classList.add('merge-selected')
		const inputFrom = document.getElementById("from-input");
		const inputTo = document.getElementById("to-input");
		const id = ev.target.id.replace('item-', '');

		if (inputFrom.value === '') {
			inputFrom.value = id;
		} else if (inputTo.value === '') {
			inputTo.value = id;
		} else {
			inputFrom.value = id;
		}
	}

	const merge = async () => {
		const from = document.getElementById("from-input").value;
		const to = document.getElementById("to-input").value;
		if (tableName === 'course') {
			await mergeCourses(from, to);
		} else {
			await mergeAssignments(from, to);
		}
	}

	useEffect(() => {
		const func = async () => {
			if (tableName === 'course') {
				// get courses
				const courses = await getCoursesAndSoftdeleted({});
				const courseElements = courses.map((course) => {
					return (
						<div className="list__item" key={course._id}  >
							<div className="list-item__header">
								<h2>{course.courseTitle}</h2>
							</div>
							<p>Klas: <strong>{course.direction}</ strong></p>
							<p>Schooljaar: <strong>{course.schoolyear}</ strong></p>
							<p>{course._id}</p>
							<button id={`item-${course._id}`} onClick={selectItem}>Selecteer</button>
						</div>
					);
				})
				setListItems(courseElements);
			} else if (tableName === 'assignment') {
				// get assignments
				const assignments = await getAssignmentsAndSoftDeleted({});
				const assignmentsElements = assignments.map((assignment) => {
					return (
						<div className="list__item" key={assignment._id}  >
							<div className="list-item__header">
								<h2>{assignment.title}</h2>
								<p>{assignment._id}</p>
							</div>
							<button id={`item-${assignment._id}`} onClick={selectItem}>Selecteer</button>
						</div>
					);
				})
				setListItems(assignmentsElements);
			}
		}

		func();
	}, [tableName])

	return(
		<div className="merge-page">
			<PageTitle>{tableName}</PageTitle>
			<button onClick={() => {
				if (tableName === 'course') {
					setTableName('assignment')
				} else {
					setTableName('course')
				}
			}}>{(tableName === 'course') ? 'Assignment' : 'course'}</button>
			<div className="merge-page__list">
				{
					(listItems.length > 0)
					? listItems
					: <p>Geen resultaten</p>
				}
			</div>
			<div className="merge-page__selector">
				<p>Van:</p>
				<input type="text" id="from-input" />
				<p>Naar:</p>
				<input type="text" id="to-input" />
				<button onClick={merge}>Voeg samen</button>
			</div>
		</div>
	);
}

export default AdminMerge;