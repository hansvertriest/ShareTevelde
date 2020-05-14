import { default as React, useState, Fragment } from 'react';

import { useApi, useAuth } from '../../services';
import { apiConfig } from '../../config';
import './Feedback.scss';

const Feedback = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;
	const { postAgree, deleteFeedback, sendNotification } = useApi();
	const { currentUser } = useAuth();

	const [userProfile] = useState(props.data.user.profile);

	const getTimeTelation = (timestamp) => {
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate()-5);
		const date = new Date(timestamp)
		// check if today / yesterday
		today.setHours(0); today.setMinutes(0); today.setSeconds(0, 0);
		date.setHours(0); date.setMinutes(0); date.setSeconds(0, 0);

		if (today === date) {
			return 'vandaag';
		}else if (yesterday === date) {
			return 'gisteren';
		} else {
			return `${date.getDate()} - ${date.getMonth()} - ${date.getFullYear()}`;
		}
	}

	const sendAgree = async (ev) => {
		await postAgree(props.data._id);
		// send notification
		let alreadyAgreed = false;
		props.data.agrees.forEach((agree) => {
			if (agree.user === currentUser.id) {
				alreadyAgreed = true;
			}
		});
		if (!alreadyAgreed) {
			sendNotification({
				userId: props.data.user._id,
				content: `${currentUser.profile.username} gaat akkoord met jouw feedback.`,
				destinationUrl: `/post/${props.data._id}`,
				type: 'agree',
			});
		}
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
					<div className="feedback-content__header">
						<a href={`/profile/${props.data.user._id}`} className="username">{userProfile.username}</a>
						<p> {getTimeTelation(props.data._createdAt)}</p>
					</div>

					<p className="feedback-content__content">
						{props.data.content}
					</p>

					<p className="feedback-content__action">
						{props.data.agrees.length}
						<span onClick={(currentUser) ? sendAgree : null}>AGREE</span>
					</p>
					
					
				</div>
				{
					(currentUser && props.data.user._id === currentUser.id)
					? <img className="feedback__delete" src="/icons/cross.svg" alt="delete-icon" onClick={removeFeedback}/>
					:undefined
				}
				
			</Fragment>
			: undefined
			}
			
		</div>
	);
};

export default Feedback;