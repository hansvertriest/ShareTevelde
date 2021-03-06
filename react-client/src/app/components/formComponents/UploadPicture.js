import { default as React, useState, useEffect } from 'react';

import {apiConfig} from '../../config';
import { useApi } from '../../services';

import './UploadPicture.scss';

const UploadPicture = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

	const { uploadImage } = useApi();

	const [filename, setFilename] = useState(undefined);
	const [previousFilename, setPreviousFilename] = useState(undefined);

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
		// get element
		const input = document.getElementById(`upload-${props.index}`);

		const formData = new FormData();
		formData.append('picture', input.files[0]);
		formData.append('width', '500');
		formData.append('height', '500');

		// upload picture
		const image = await uploadImage(formData);

		// save filename
		setPreviousFilename(image.filename);
		setFilename(image.filename);
		props.onSelected(image.filename, previousFilename)
	}

	useEffect(() => {
		window.addEventListener('resize', setDimension)
		setDimension();
	}, [filename]);
	
	return(
		<div className="picture-upload">
			<div className="picture-upload__picture-container" id={`picture-container-${props.index}`} onClick={clickFileUpload}>
				<img 
					className=" picture-container picture-container--empty"
					id="picture-container"
					src={ (filename) ? `${BASE_URL}/image/byname/${filename}` : "./icons/upload.svg"}
					alt="Upload icon"
					onLoad={
						(filename) 
						?() => {
							// swap styles
							const target = document.querySelector(`#picture-container-${props.index} #picture-container`);
							target.classList.remove('picture-container--empty')
							target.classList.add('picture-container--displayed')
						}
						: undefined
					}
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
				<input type="text" id={`title-${props.index}`} className={'title-input'} placeholder="Titel van jouw foto" autoComplete="off" />
				<textarea 
					id={`description-${props.index}`} 
					className={'description-input'} 
					placeholder="Eventuele omschrijving van de foto." 
					rows="4" cols="60"
					maxLength="200"
					>
					</ textarea>
			</div>
		</div>
	);
}

export default UploadPicture;