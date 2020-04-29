import { default as React, useState, useEffect } from 'react';

import './TertiaryButton.scss';

const TertiaryButton = (props) => {
	return(
		<a
			className="tertiary-button"
			id={props.id || ''}
			href="#"
			onClick={(ev) => props.onClick(ev)}
		>
			{props.children}
		</a>
	);
}

export default TertiaryButton;