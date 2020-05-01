import { default as React } from 'react';

import './SecondaryButton.scss';

const SecondaryButton = (props) => {
	return(
		<button
			className="secondary-button"
			id={props.id || ''}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}

export default SecondaryButton;