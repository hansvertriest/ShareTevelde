import { default as React, useState, useEffect } from 'react';

import { useApi, useAuth } from '../services';
import { apiConfig } from '../config';

import { Menu } from '../components/menu';
import { PageTitle, Label } from '../components/typography'
import { TextArea, DropDown, InputFieldText } from '../components/formComponents';

import './ProfileConfig.scss';

const Profileconfig = ({children}) => {
	const BASE_URL = `${apiConfig.baseURL}`;
	const { currentUser, refresh } = useAuth();
	const { uploadImage, updateUser, socialMediums } = useApi();

	const [socialMedia, setSocialMedia] = useState([]);

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
		const value = input.value.trim();
		// validate 
		let isCorrect = true;
		if (value.includes(' ')) {
			isCorrect = false;
		}

		// update profile
		if (isCorrect) {
			await updateUser({username: value})

			// refresh currentUser
			refresh();
			
			// give feedback
			const container = document.getElementById('username-container');
			container.classList.add('input--succes');
			container.classList.remove('input--error');
		} else {
			// give feedback
			const container = document.getElementById('username-container');
			container.classList.add('input--error');
			container.classList.remove('input--succes');
		}
	}

	
	const uploadDescription = async (ev) => {
		const input = ev.target;
		const value = input.value.trim();
		// validate 
		let isCorrect = true;
		
		// update profile
		if (isCorrect) {
			await updateUser({profileDescription: value});

			// refresh currentUser
			refresh();
			
			// give feedback
			input.classList.add('input--succes');
			input.classList.remove('input--error');
		} else {
			// give feedback
			input.classList.add('input--error');
			input.classList.remove('input--succes');
		}
	}

	const uploadSocialMedium = async (ev) => {
		// get values
		const input = ev.target
		const medium = input.id;
		const url = input.value;
		console.log(medium, url);
		// validate 
		const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		let isCorrect = pattern.test(url);

		// update profile
		if (isCorrect) {
			await updateUser({[medium]: url});

			// refresh currentUser
			refresh();
			
			// give feedback
			input.classList.add('input--succes');
			input.classList.remove('input--error');
		} else {
			// give feedback
			input.classList.add('input--error');
			input.classList.remove('input--succes');
		}

	}

	const selectSocialMedium = (ev) => {
		let value = ev.target.value;
		value = 'link' + value;

		const element = 
			<div className="medium-input-container"  key={value}>
				<img src={`./icons/${value.replace('link', '')}.svg`} alt="social medium-icon"/>
				<InputFieldText 
					defaultValue={(currentUser.profile[value]) ? currentUser.profile[value] : "www."} 
					onBlur={uploadSocialMedium} 
					id={value}/>
			</div>
		const newElements = [...socialMedia, element];
		if (!currentUser.profile[value]) setSocialMedia(newElements);
	}

	useEffect(() =>{
		// refresh currentUser
		refresh();
		console.log(currentUser)

		//get socialmedia
		const elements = []
		socialMediums.forEach((medium) => {
			if (currentUser.profile[medium]) {
				elements.push( 
					<div className="medium-input-container" id={medium} key={medium}>
						<img src={`./icons/${medium.replace('link', '')}.svg`} alt="social medium-icon"/>
						<InputFieldText 
							defaultValue={(currentUser.profile[medium]) ? currentUser.profile[medium] : "www."} 
							onBlur={uploadSocialMedium} 
							id={medium}/>
					</div>
				)
			}
		});
		console.log(elements)
		setSocialMedia(elements);

	}, []);
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
				<PageTitle>Profiel</PageTitle>
				<div className="profile-form-container__profile-picture-section">
					<div className="picture-container" onClick={onProfilePictureClick}>
						<img src={`${BASE_URL}/image/byname/${currentUser.profile.profilePictureName}`} className="profile-picture"/>
						<img src="./icons/camera.svg" className="overlay"/>
						<input type="file" id={'upload-picture'} onChange={uploadPicture} accept="image/*"/>
					</div>
					<div className="username-container" id="username-container">
						<img src="./icons/pen.svg"/>
						<input type="text" defaultValue={currentUser.profile.username} onBlur={uploadUsername}/>
					</div>
				</div>
				
				<div className="profile-form-container__description-media-section">
					<div className="description-container">
						<Label>Omschrijving</Label>
						<TextArea 
							rows="5"
							maxLength="300"
							defaultValue={currentUser.profile.profileDescription}
							onBlur={uploadDescription}
						/>
					</div>
					<div className="social-media-container">
						<Label>Social media</Label>
						<DropDown onChange={selectSocialMedium}>
							<option value="Fb">Facebook</option>
							<option value="Insta">Instagram</option>
							<option value="Twitter">Twitter</option>
							<option value="YT">Youtube</option>
							<option value="Vimeo">Vimeo</option>
						</DropDown>
						
						{socialMedia}
					</div>
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