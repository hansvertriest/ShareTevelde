import { default as React, useState, useEffect, Fragment } from 'react';

import {InputFieldText } from './';

import './InputFieldTextWithResults.scss';

const InputFieldTextWithResults = (props) => {
	const [results, setResults] = useState([]);

	const getResults = async (ev) => {
		const input = ev.target.value;
		// show result container
		const container = document.getElementById(`${props.id}-result-container`);
		container.classList.add('form-search-results--show');
		// if (input.length > 0) {
		// 	container.classList.add('search-results--show');
		// } else {
		// 	container.classList.remove('search-results--show');
		// }

		// get results
		const resultElements = await props.fetchResults(input);
		setResults(resultElements);
	}

	return(
		<Fragment>
			<p className="text-input-label">{props.label}</p>
			<InputFieldText 
				id={props.id}
				name={props.name}
				placeholder={props.placeholder}
				onChange={getResults}
				onClick={getResults}
			/>
			<div className="form-search-results" id={`${props.id}-result-container`}>
				{
					(results)
					? (results.length > 0) ? results : <p className="no-results">Geen resultaten</p>
					: <p>{props.searchingMessage}</p>
				}
				
			</div>
		</Fragment>
	);
}

export default InputFieldTextWithResults;