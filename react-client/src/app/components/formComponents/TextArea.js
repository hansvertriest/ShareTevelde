import { default as React } from 'react';

import './TextArea.scss';

const TextArea = (props) => {
	/* Validate
			ev = event
			errorContainerId = when not provided no error will be shown 
	*/
	const validate = (ev, showError = false) => {
		// validate input
		const validation = (props.validate) ? props.validate(ev) : false;

		// get input element
		const inputElement = ev.target;

		// show feedback
		if (validation.passed === false) {
			// show error
			if (showError) {
				const errorContainer = document.getElementById(`${props.id}-error`);
				errorContainer.innerHTML = validation.error;
				errorContainer.classList.add('error-field--show');
			}
			
			// set style
			inputElement.classList.remove('input-container__textarea--passed');
			inputElement.classList.add('input-container__textarea--error');
		} else if (validation) {
			// hide error regardless if id is given
			const errorContainer = document.getElementById(`${props.id}-error`)
			errorContainer.classList.remove('error-field--show');

			// set style
			inputElement.classList.remove('input-container__textarea--error');
			inputElement.classList.add('input-container__textarea--passed');
		}
	}
	return(
		<div className="textarea-container">
			<textarea 
				className="input-container__textarea"
				type={props.type} 
				id={props.id}
				placeholder={props.placeholder} 
				name={props.name}
				autoComplete={props.autoComplete || 'off'}
				onChange={(props.validate) ? (ev) => validate(ev) : (props.onChange) ? props.onChange : null}
				onBlur={(props.validate) ? (ev) => validate(ev, props.showErrors || false) : (props.onBlur) ? props.onBlur : null}
				onClick={(props.onClick) ? props.onClick : null}
				cols={props.cols}
				rows={props.rows}
				defaultValue={props.defaultValue}
				maxLength={props.maxLength}
				/>
			<p className="error-field" id={`${props.id}-error`}></p>
		</div>
	);
}

export default TextArea;