import { default as React, useState, useEffect, Fragment } from 'react';

import { useApi, useAuth } from '../../services';
import { apiConfig } from '../../config';
import './Feedback.scss';

const Feedback = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;
	const { postAgree, deleteFeedback } = useApi();
	const { currentUser } = useAuth();

	const [userProfile, setUserProfile] = useState(props.data.user.profile);

	const getTimeTelation = (timestamp) => {
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate()-5);
		const date = new Date(timestamp)
		// check if today / yesterday
		today.setHours(0); today.setMinutes(0); today.setSeconds(0, 0);
		date.setHours(0); date.setMinutes(0); date.setSeconds(0, 0);

		if (today == date) {
			return 'vandaag';
		}else if (yesterday == date) {
			return 'gisteren';
		} else {
			return `${date.getDate()} - ${date.getMonth()} - ${date.getFullYear()}`;
		}
	}

	const sendAgree = async (ev) => {
		await postAgree(props.data._id);
		props.onUpdate();
	}

	const removeFeedback = async () => {
		await deleteFeedback(props.data._id);
		props.onUpdate();
	}

	return (
		<div className="feedback">
			{
			(userProfile)
			? 
			<Fragment >
				<a  href={`/profile/${props.data.user._id}`} className="feedback__img">
					<img
						src={`${BASE_URL}/image/byname/${userProfile.profilePictureName}`}
						alt="profile"
					/> 
				</a>

				<div className="feedback__content">
					<a href={`/profile/${props.data.user._id}`} className="feedback-content__username">
						{userProfile.username}
						<span> {getTimeTelation(props.data._createdAt)}</span>
					</a>

					<p className="feedback-content__content">
						{props.data.content}
					</p>

					<p className="feedback-content__action">
						{props.data.agrees.length}<span onClick={sendAgree}>AGREE</span>
					</p>
					
				</div>
				{
					(props.data.user._id === currentUser.id)
					? <img className="feedback__delete" src="/icons/cross.svg" onClick={removeFeedback}/>
					:undefined
				}
				
			</Fragment>
			: undefined
			}
			
		</div>
	);
};

export default Feedback;