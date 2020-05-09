import { default as React, useState, useEffect, Fragment } from 'react';

import { useApi, useAuth } from '../services';
import { Menu } from '../components/menu';
import { PageTitle, Label } from '../components/typography';
import { InputFieldTextWithResults, InputFieldText, UploadPicture } from '../components/formComponents';

// import { ProfilePicture, SocialMediaField } from '../components/formComponents';

import './NewPost.scss';
import { toolBox } from '../utilities';

const NewPost = ({children}) => {
	const { getCourses, getAssignments, createNewCourse, createNewAssignment, uploadPictureWithFilename,createPosts } = useApi();
	const { currentUser } = useAuth();

	// component collections
	const [picturesElements, setPicturesElements] = useState([]);

	// post data
	const [courseId, setCourseId] = useState(undefined);
	const [assignmentId, setAssignmentId] = useState(undefined);
	const [url, setUrl] = useState(undefined);
	const [imageNames, setImageNames] = useState([]);
	
	// update triggers
	const [updatePictures, setUpdatePictures] = useState(true);
	const [updateImageNames, setUpdateImageNames] = useState(false);
	
	// temp data container
	const [oldImage, setOldImage] = useState(undefined);;

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

	// create new assignment
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

	// when a photo is selected render new blank picture
	const createNextCard = async (imageName, oldImage = undefined) => {
		if (oldImage) setOldImage(oldImage);
		setUpdateImageNames(imageName);
		setUpdatePictures(true);
	}

	const uploadPost = async (ev) => {
		ev.preventDefault();
		// gather picture data
		let pictures = [];
		for (let index = 0; index < picturesElements.length; index++) {
			const title = document.getElementById(`title-${index}`).value;
			const description = document.getElementById(`description-${index}`).value;
			const filename = imageNames[index];
			// only upload when img is present
			if (filename) {
				const picture = await uploadPictureWithFilename(title, description, filename);
				pictures.push(picture._id);
			}
		}
		pictures = JSON.stringify(pictures);

		if (assignmentId && pictures.length > 0) {

			const post = await createPosts(assignmentId, url, pictures);
			console.log(post);
		}

	}

	useEffect(() => {
		if (updatePictures && updateImageNames) {
			if (oldImage) {
				// no new element is created
				// update imageNames
				const currentImages =  
					imageNames.map((imageName) => {
						if (imageName === oldImage) {return oldImage}
						return imageName;
					})
				const newImages = currentImages;
				setImageNames(newImages);
				setOldImage(undefined);
				setUpdateImageNames(undefined);
			} else {
				// create new picture element
				const nextIndex = (picturesElements) ? picturesElements.length : 0;
				const newPictures = [...picturesElements, <UploadPicture key={nextIndex} index={nextIndex} onSelected={createNextCard}/>]
				setPicturesElements(newPictures);
				
				// update imageNames
				const newImages = [...imageNames, updateImageNames]
				setImageNames(newImages);
				setUpdateImageNames(undefined);
			}
			setUpdatePictures(false);
		} else if (updatePictures && picturesElements.length === 0) {
			// create new picture element
			const nextIndex = (picturesElements) ? picturesElements.length : 0;
			const newPictures = [...picturesElements, <UploadPicture key={nextIndex} index={nextIndex} onSelected={createNextCard}/>]
			setPicturesElements(newPictures);
		} 
	}, [updatePictures, updateImageNames]);

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
				<form encType="multipart/form-data" action="/" method="post">
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
							defaultValue="www."
							onChange={(ev) => setUrl(ev.target.value)}
						/>
					</div>
					<div className="post-form-container__pictures-section">
						<Label>Foto's</Label>
						
						{picturesElements}

					</div>
					<button type="submit" onClick={uploadPost}> Upload post</button>
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