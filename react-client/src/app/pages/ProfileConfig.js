import { default as React, useState, useEffect } from 'react';

import { useApi, useAuth } from '../services';
import { apiConfig } from '../config';

import { Menu } from '../components/menu';
import { PageTitle } from '../components/typography'

import './ProfileConfig.scss';

const Profileconfig = ({children}) => {
	const BASE_URL = `${apiConfig.baseURL}`;
	const { currentUser, refresh } = useAuth();
	const { uploadImage, updateUser } = useApi();


	const onProfilePictureClick = (ev) => {
		const inputElement = document.getElementById('upload-picture');
		inputElement.click();
	}

	const uploadPicture = async () => {
		// get element
		const input = document.getElementById('upload-picture');

		const formData = new FormData();
		formData.append('picture', input.files[0]);

		// upload picture
		const image = await uploadImage(formData);
		const filename = image.filename;

		// update profile
		await updateUser({profilePictureName: filename});

		// refresh currentUser
		refresh();
	}

	const uploadUsername = async (ev) => {
		const input = ev.target;
		// update profile
		await updateUser({username: input.value});

		// refresh currentUser
		refresh();
	}
	console.log(currentUser)

	return (
		<div className="page__profile-config">
			
			<div className="aside-container aside-container--top">
				{
					(currentUser)
					? <Menu id="menu-top"/>
					: null
				}
			</div>
			<div className="profile-form-container">
				
				<PageTitle>Profiel bewerken</PageTitle>
				<div className="profile-form-container__profile-picture-section">
					<div className="picture-container" onClick={onProfilePictureClick}>
						<img src={`${BASE_URL}/image/byname/${currentUser.profile.profilePictureName}`} className="profile-picture"/>
						<img src="./icons/camera.svg" className="overlay"/>
						<input type="file" id={'upload-picture'} onChange={uploadPicture} />
					</div>
					<div className="username">
						<input type="text" value={currentUser.profile.userName} onBlur={uploadUsername}/>
					</div>
				</div>
				
				<div className="profile-form-container__description-media-section">
					 
				</div>

				<div className="profile-form-container__password-reset">
					 
				</div>
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

export default Profileconfig;