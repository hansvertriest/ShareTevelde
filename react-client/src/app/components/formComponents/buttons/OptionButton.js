import { default as React } from 'react';

import './OptionButton.scss';

const OptionButton = (props) => {

	const enable = (ev) => {
		ev.preventDefault();
		const btn = ev.target;
		if (btn.classList.contains('option-button--enabled')){
			btn.classList.remove('option-button--enabled');
		} else {
			btn.classList.add('option-button--enabled');
		}
	}

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