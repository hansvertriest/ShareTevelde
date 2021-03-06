import { default as React } from 'react';

import './PrimaryButton.scss';

const PrimaryButton = (props) => {
	return(
		<button
			className="primary-button"
			// id={props.id || ''}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}

export default PrimaryButton;