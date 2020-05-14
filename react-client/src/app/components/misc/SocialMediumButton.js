import { default as React } from 'react';

import './SocialMediumButton.scss';

const SocialMediumButton = (props) => {
	return (
		<a className="social-media-button" href={`https://${props.url}`} target="blank"><img src={`/icons/${props.imgName}.svg`} alt="social media icon"/></a>
	);
};

export default SocialMediumButton;