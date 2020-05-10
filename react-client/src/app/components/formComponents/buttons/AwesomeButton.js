import { default as React } from 'react';

import './AwesomeButton.scss';

const Awesomebutton = (props) => {
	return(
		<button
			className={`awesome-button ${(props.hasLiket) ? 'awesome-button--inactive' : ''}`}
			// id={props.id || ''}
			onClick={props.onClick}
		>
			<img src="/icons/awesome.svg" alt="awesome"/>
		</button>
	);
}

export default Awesomebutton;