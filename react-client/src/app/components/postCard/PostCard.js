import { default as React, useState, useEffect } from 'react';

import { apiConfig } from '../../config';
import { H2 } from '../../components/typography';
import './PostCard.scss';

const PostCard = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

	const [data] = useState(props.postData);


	// console.log(props.postData.assignment.courseId.direction, props.postData.assignment.courseId.schoolyear)
	
	// when picture is loaded
	const pictureOnload = () => {
		const loadingText = document.querySelector('.loading-text p');
		loadingText.innerHTML = 'Volgende berichten worden geladen...';

		const infoContainer = document.querySelector(`#${props.id} .post-card__info`);
		infoContainer.style.bottom = "10px";
	}

	// set dimensions of picture
	const setSquareDimensions = () => {
		const picture = document.getElementById(`post-card__img-${props.id}`);
		const pictureHeader = document.querySelector(`#post-card__img-${props.id} .post-card-img__header`);
		picture.style.height = `${picture.offsetWidth}px`;
		pictureHeader.style.width = `${picture.offsetWidth}px`;
	}

	useEffect(() => {
		setSquareDimensions();

		// listener for setting square dimensions
		window.addEventListener('resize', () => {
			setSquareDimensions();
		});
	}, []);

  	return (
		<div className="post-card" id={props.id} >
			<div className="post-card__img" id={`post-card__img-${props.id}`}> 
				<div className="post-card-img__header">
					<a className="post-card-img-header__profile-container" href={`/profile/${data.user._id}`}>
						{
						(data.user.profile.profilePictureName) ?
						<img 
							src={`${BASE_URL}/image/byname/${data.user.profile.profilePictureName}`}
							alt="profile"	
						/>
						: undefined
						}
						<p>{data.user.profile.username}</p>
					</a>
					{
						(props.postData.urlToProject)
						? <a className="post-card-img-header__url" target="blank" href={`https://${props.postData.urlToProject}`}><img src="./icons/url.svg" alt="Full project url" /></a>
						: null
					}
				</div>
				<a href={`/post/${data._id}`}>
					<img 
						className="post-card-img__project-pic"
						src={(data)
							? `${BASE_URL}/image/byname/${data.pictures[0].filename}`
							: ''
						}
						alt="Post"
						onLoad={(ev) => pictureOnload()}
					></img>
				</a>
				
			</div>
			<div className="post-card__info">
				<a href={`/assignment/${data.assignment._id}`}><H2 onClick={()=> console.log(666)}>{(data) ? data.assignment.title : undefined}</H2></a>
				<div className="info__footer">
					<p className="card-info">feedback: <span>{(data) ? data.feedback.length : undefined}</span></p>
					<div className="info__footer__likes">
						<img src="./icons/awesome.svg" alt="Like icon."/>
						<p className="card-info"><span>{(data) ? data.likes.length : undefined}</span></p>
					</div>
				</div>
			</div>
		</div>
 	);
};

export default PostCard;