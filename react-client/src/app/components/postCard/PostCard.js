import { default as React, useState } from 'react';

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

  	return (
		<div className="post-card" id={props.id} >
			<div className="post-card__img" > 
				<div className="post-card-img__header">
					<div className="post-card-img-header__profile-container">
						<img 
							src={(data.user.profile.profilePictureName)
								? `${BASE_URL}/image/byname/${data.user.profile.profilePictureName}`
								: ''
							}
							alt="profile"	
						/>
						<p>{data.user.profile.username}</p>
					</div>
					{
						(props.postData.urlToProject)
						? <a className="post-card-img-header__url" target="blank" href={`https://${props.postData.urlToProject}`}><img src="./icons/url.svg" alt="Full project url" /></a>
						: null
					}
				</div>
				<img 
					className="post-card-img__project-pic"
					src={(data)
						? `${BASE_URL}/image/byname/${data.pictures[0].filename}`
						: ''
					}
					alt="Post"
					onLoad={(ev) => pictureOnload()}
				></img>
			</div>
			<div className="post-card__info">
				<H2>{(data) ? data.assignment.title : undefined}</H2>
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