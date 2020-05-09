import { default as React, useState, Fragment } from 'react';

import {InputFieldText, TertiaryButton } from './';
import { H3, Label } from '../typography';

import './InputFieldTextWithResults.scss';

const InputFieldTextWithResults = (props) => {
	const [results, setResults] = useState([]);

	const getResults = async (ev) => {
		const input = ev.target.value;
		// remove form container 
		document.getElementById(`${props.id}-result-container`).classList.remove('form-search-results--show');
		// show result container
		const container = document.getElementById(`${props.id}-result-container`);
		// container.classList.add('form-search-results--show');
		if (input.length > 0) {
			container.classList.add('form-search-results--show');
		} else {
			container.classList.remove('form-search-results--show');
		}

		// get results
		const resultElements = await props.fetchResults(input);
		setResults(resultElements);
	}

	const showForm = () => {
		document.querySelector(`.${props.id}-create-form`).classList.add(`${props.id}-create-form--show`)
		document.getElementById(`${props.id}-result-container`).classList.remove('form-search-results--show')
	}

	const createNew = async () => {
		const created = await props.onCreate();
		if (created && created[props.title]) {
			document.getElementById(`${props.id}`).value = created[props.title];
			document.querySelector(`.${props.id}-create-form`).classList.remove(`${props.id}-create-form--show`)
			props.onComplete();
		} else {
			document.getElementById('form-error').innerHTML = 'Gelieve de gegevens juist in te vullen.';
		}
	}	

	return(
		<Fragment>
			<Label className="text-input-label">{props.label}</Label>
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
				<div className = "form-search-results__add" onClick={showForm}>
					<p>Toevoegen</p>
				</div>
			</div>
			<div className={`${props.id}-create-form`}>
				<H3>Toevoegen</H3>
				{props.form}
				<TertiaryButton onClick={createNew}>Voeg toe</TertiaryButton>
			</div>
			<p id="form-error"></p>
		</Fragment>
	);
}

export default InputFieldTextWithResults;