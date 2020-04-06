import { default as React, useState, useEffect } from 'react';

import { useApi } from '../services/api.services';
import { apiConfig } from '../config';

import { ProfilePicture, SocialMediaField } from '../components/formComponents';

import './ProfileConfig.scss';

const Profileconfig = ({children}) => {
	const { userProfile, refreshUserProfile, putTextToMongo } = useApi();
	const [ pictureUrl, setPictureUrl ] = useState(`${apiConfig.baseURL}/pictures/${userProfile.profilePictureName}`);

	useEffect(() => {
		setPictureUrl(`${apiConfig.baseURL}/pictures/${userProfile.profilePictureName}`);
	}, [userProfile]);

	/*
		sanitizes the username
			username: username to be sanitzed
		TODO: add security sanitizing
	*/
	const sanitizeUsername = (username) => {
		if (!username.includes(' ') && username !== '') {
			return username;
		}
		document.getElementById('username').value = userProfile.userName;
		return undefined
	}

	/*
		Uploads the value of the field to db
			paramKey: key of the property used in db
			inputId: id of DOM element that contains the value
	*/
	const submitField = (paramKey, inputId) => {
		const fieldValue = document.getElementById(inputId).value;
		const sanitizedValue = sanitizeUsername(fieldValue);
		if (sanitizedValue) {
			const formData = new FormData();
			formData.append(paramKey, sanitizedValue);
			formData.append('id', userProfile._id);
			
			putTextToMongo(formData, '/user');
		}
	}

	return (
		<div>
			<form action='/uploadconfig' method="post" encType="multipart/form-data">
				<div className="top-section">
					<ProfilePicture pictureUrl={pictureUrl} id={userProfile._id}/>
					<div>
						<input 
							name="username" 
							id="username" 
							defaultValue={userProfile.userName} 
							onBlur={(ev) => {
								if (ev.target.value != userProfile.userName) {
									submitField('userName', 'username');
								}
							}} 
						/>
						<p id="error-username" className="error"></p>
					</div>
				</div>
				<SocialMediaField id={userProfile._id} website="facebook" urlPropName="linkFb" id={userProfile._id} value={userProfile.linkFb || ''} />
				<SocialMediaField id={userProfile._id} website="twitter" urlPropName="linkTwitter" id={userProfile._id} value={userProfile.linkTwitter || ''} />
				<SocialMediaField id={userProfile._id} website="instagram" urlPropName="linkInsta" id={userProfile._id} value={userProfile.linkInsta || ''} />
				<SocialMediaField id={userProfile._id} website="youtube" urlPropName="linkYt" id={userProfile._id} value={userProfile.linkYt || ''} />
				<SocialMediaField id={userProfile._id} website="vimeo" urlPropName="linkVimeo" id={userProfile._id} value={userProfile.linkVimeo || ''} />
			</form>
		</div>
	);
};

export default Profileconfig;