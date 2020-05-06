import { default as React, useState, useEffect } from 'react';

import {apiConfig} from '../../config';
import { useApi } from '../../services';

import './UploadPicture.scss';

const UploadPicture = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

	const { uploadImage } = useApi();

	const [filename, setFilename] = useState(undefined);

	const setDimension = () => {
		const container = document.getElementById(`picture-container-${props.index}`);
		const containerText = document.querySelector(`#picture-container-${props.index} .picture-container-button`);
		container.style.height = `${container.offsetWidth}px`;
		containerText.style.width = `${container.offsetWidth}px`;
		containerText.style.height = `${container.offsetWidth}px`;
	}

	const clickFileUpload = () => {
		const button = document.getElementById(`upload-${props.index}`);
		button.click();
	}

	const onFileSelected = async () => {
		// get elements
		const input = document.getElementById(`upload-${props.index}`);
		const target = document.getElementById('picture-container');

		const formData = new FormData();
		formData.append('picture', input.files[0]);

		const image = await uploadImage(formData);
		setFilename(image.filename);

		// swap styles
		target.classList.remove('picture-container--empty')
		target.classList.add('picture-container--displayed')

		// props.onSelected()
	}

	useEffect(() => {
		setDimension();
		console.log(filename)
	}, [filename]);
	
	return(
		<div className="picture-upload">
			<div className="picture-upload__picture-container" id={`picture-container-${props.index}`} onClick={clickFileUpload}>
				<img 
					className=" picture-container picture-container--empty"
					id="picture-container"
					src={ (filename) ? `${BASE_URL}/image/byname/${filename}` : "./icons/upload.svg"}
					alt="Upload icon"	
				/>
				<div className="picture-container-button">
					{
						(props.imageName)
						? <p>Afbeelding wijzigen</p>
						: <p>Upload afbeelding</p>
					}
				</div>
				<input type="file" id={`upload-${props.index}`} onChange={onFileSelected}/>
			</div>
			<div className="picture-upload__text-container">
				<input type="text" id={`title-${props.index}`} placeholder="Titel van jouw foto" />
				<input type="textarea" id={`description-${props.index}`} placeholder="Eventuele omschrijving van de foto." />
			</div>
		</div>
	);
}

export default UploadPicture;