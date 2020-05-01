import { default as React } from 'react';

import './TertiaryButton.scss';

const TertiaryButton = (props) => {
	return(
		<a
			className="tertiary-button"
			id={props.id || ''}
			href={props.href || '#'}
			onClick={(props.onClick) ? (ev) => props.onClick(ev) : null}
		>
			{props.children}
		</a>
	);
}

export default TertiaryButton;