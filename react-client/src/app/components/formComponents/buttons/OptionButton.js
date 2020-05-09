import { default as React } from 'react';

import './OptionButton.scss';

const OptionButton = (props) => {
	return(
		<button
			className={`option-button option-button--${props.specifier}`}
			value={props.value}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}

export default OptionButton;