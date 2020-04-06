import { default as React, useState, useEffect } from 'react';

import { apiConfig } from '../../config';
import { useApi } from '../../services/';

const SocialMediaField = (props) => {
	const { putTextToMongo } = useApi();
	/*
		sanitizes the url input
			input: url to be sanitzed
			website: website the url should lead to
		TODO: add security sanitizing
	*/
	const sanitizeInput = (input, website) => {
		if (input.slice(0, 12) === 'https://www.'){
			if (input.slice(12, 12 + website.length) === website) {
				return input.slice(12)
			}
		}
		if (input.slice(0, 4) === 'www.') {
			if (input.slice(4, 4 + website.length) === website) {
				return input.slice(4)
			}
		}
		if (input.slice(0, 8) === 'https://') {
			if (input.slice(8, 8 + website.length) === website) {
				return input.slice(8)
			}
		}
		if (input.slice(0,website.length) === website) {
			return input;
		}
		if (input === '') {
			return input;
		}
		return undefined
	}

	/*
		If url is succesfuil sanitized update user in db
			urlPropName: property key of url in db
			website: website name where the url should lead to
		TODO: add security sanitizing
	*/
	const submitField = (urlPropName, website) => {
		const fieldValue = document.getElementById(website).value;
		const sanitizedValue = sanitizeInput(fieldValue, website);
		document.getElementById(website).value = sanitizedValue || '';

		if (sanitizedValue) {
			// create formdata
			const formData = new FormData();
			formData.append(urlPropName, sanitizedValue);
			formData.append('id', props.id);
			
			// upload to mongo
			putTextToMongo(formData, '/user');
		}
	}

	return(
		<div className={`social-media-link-container social-media-link-container--${props.website}`}>
					<input 
						name={props.website}
						id={props.website}
						defaultValue={props.value} 
						onBlur={(ev) => {
							if (ev.target.value != props.value) {
								submitField(props.urlPropName, props.website);
							}
						}} 
					/>
					<p id={`error-${props.website}`} className="error"></p>
			</div>
	);
}

export default SocialMediaField;