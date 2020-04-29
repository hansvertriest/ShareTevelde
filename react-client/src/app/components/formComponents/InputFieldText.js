import { default as React, useState, useEffect } from 'react';

import './InputFieldText.scss';

const InputFieldText = (props) => {
	const [style, setStyle] = useState({});
	const validate = (ev) => {
		const validation = (props.validate) ? props.validate(ev) : false;
		if (validation) {
			setStyle({borderLeft: '3px solid var(--primary-color)'});
		} else {
			setStyle({borderLeft: '3px solid var(--secondary-color)'});
		}
	}
	return(
		<input 
			className="text-input"
			type={props.type} 
			id={props.id}
			style={style}
			placeholder={props.placeholder} 
			name={props.name}
			autoComplete={props.autoComplete || 'email'}
			onBlur={(props.validate) ? validate : null}
			>
		</input>
	);
}

export default InputFieldText;