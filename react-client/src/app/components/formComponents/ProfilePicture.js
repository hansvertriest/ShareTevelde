import { default as React, useState, useEffect } from 'react';


import { useApi } from '../../services/';
import { apiConfig } from '../../config';

const ProfilePicture = (props) => {
	const { putTextToMongo, postImageToMongo } = useApi();
	/*
		Triggers click event of file input when clicked on image
	*/
	const profilePicOnClick = (event) => {
		const pictureInputElement = document.getElementById('picture-input');
		pictureInputElement.click();
	}

	/*
		Sends post request of profile picture
			paramKey: parameter key used in the body of the request
			inputId: id of the file input field
	*/
	const submitPostImg = (paramKey, inputId) => {
		const formData = new FormData();
		formData.append(paramKey, document.getElementById(inputId).files[0]);

		postImageToMongo( formData )
			.then(res => {
				const profilePicture = document.getElementById('profile-picture');
				profilePicture.src = `${apiConfig.baseURL}/pictures/${res.filename}`;
				
				const filename = new FormData();
				filename.append('profilePictureName', res.filename);
				filename.append('id', props.id);
				putTextToMongo(filename, '/user')
			})
	}

	/*
		Reads the selected file and displays it in the profile image
	*/
	const fileSelected = (event) => {
			submitPostImg('picture', 'picture-input');
	}

	return (
		<div className="img-upload-container">
			<img src={props.pictureUrl} className="img-upload-cointainer__img" id="profile-picture" onClick={(ev) => profilePicOnClick(ev)}/>
			<input 
				type='file' 
				name="profile-picture" 
				className="img-upload-cointainer__input hidden" 
				id="picture-input" 
				accept=".png,.jpg" 
				onChange={(ev) => fileSelected(ev)} />
		</div>
	);
}

export default ProfilePicture;