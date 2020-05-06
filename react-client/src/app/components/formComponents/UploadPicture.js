import { default as React, useState, useEffect } from 'react';

import {apiConfig} from '../../config';

import './UploadPicture.scss';

const UploadPicture = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

	const setDimension = () => {
		const container = document.getElementById(`picture-container-${props.index}`);
		console.log(container);
		container.style.height = `${container.offsetWidth}px`;;
	}

	useEffect(() => {
		setDimension();
	}, []);
	
	return(
		<div className="picture-upload">
			<div className="picture-upload__picture-container" id={`picture-container-${props.index}`}>
				{
				(props.imageName) 
					?<img 
						src={`${BASE_URL}/image/byname/${props.imageName}`}
						alt={`Upload number ${props.index}`}
					/>
					: <img 
						className="picture-container--empty"
						src="./icons/upload.svg"
						alt="Upload icon"	
					/>
				}
			</div>
			<div className="picture-upload__text-container">
				<input type="text" id={`title-${props.index}`} placeholder="Titel van jouw foto" />
				<input type="textarea" id={`description-${props.index}`} placeholder="Eventuele omschrijving van de foto." />
			</div>
		</div>
	);
}

export default UploadPicture;