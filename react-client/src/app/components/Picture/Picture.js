import { default as React, useEffect } from 'react';

import { apiConfig } from '../../config';
import { H2 } from '../typography';
import './Picture.scss';

const Picture = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;
	// when picture is loaded
	const pictureOnload = () => {
		if (props.data.title.length || props.data.description) {
			const infoContainer = document.querySelector(`#picture-${props.id} .picture__info`);
			infoContainer.style.bottom = "10px";
		}
	}

	// set dimensions of picture
	const setSquareDimensions = () => {
		const picture = document.getElementById(`picture__img-${props.id}`);
		picture.style.height = `${picture.offsetWidth}px`;
	}

	useEffect(() => {
		setSquareDimensions();

		// listener for setting square dimensions
		window.addEventListener('resize', () => {
			setSquareDimensions();
		});
	}, []);

  	return (
		<div className="picture" id={`picture-${props.id}`} >
			<div className="picture__img" id={`picture__img-${props.id}`}> 
				<img 
					className="picture-img__project-pic"
					src={(props.id)
						? `${BASE_URL}/image/byname/${props.data.filename}`
						: ''
					}
					alt=""
					onLoad={(ev) => pictureOnload()}
				></img>
			</div>
			
			{
			(props.data.title || props.data.description)
			? 
				<div className="picture__info">
					{
					(props.data.title) ? <H2>{props.data.title}</H2>
					: undefined
					}
					{
					(props.data.description) ? <p>{props.data.description}</p>
					: undefined
					}
				</div>
			: undefined
			}
			
		</div>
 	);
};

export default Picture;