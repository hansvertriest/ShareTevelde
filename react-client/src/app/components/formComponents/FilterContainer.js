import { default as React, useState } from 'react';

import { apiConfig } from '../../config';
import { useApi } from '../../services';
import { H2, H3 } from '../typography';
import { OptionButton, PrimaryButton } from '../formComponents';
import './FilterContainer.scss';

const FilterContainer = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

	const [filterIcon, setFilterIcon] = useState('filter-disabled');

	let classFilter = [];
	let schoolYearFilter = [];

	const openFilterContainer = (ev) => {
		console.log('dd')
		const filters = document.getElementById(`filter-container__filter-body-${props.position}`);
		if (filters.classList.contains('filter-container__filter-body--hide')){
			filters.classList.remove('filter-container__filter-body--hide');
		} else {
			filters.classList.add('filter-container__filter-body--hide');
		}
	}

	const enableClassButton = (ev) => {
		ev.preventDefault();
		const btn = ev.target;
		if (btn.classList.contains('option-button--enabled')){
			btn.classList.remove('option-button--enabled');
			classFilter = classFilter.filter((filter) => filter !== btn.value);
		} else {
			btn.classList.add('option-button--enabled');
			classFilter.push(btn.value);
		}
		
	}

	const enableSchoolYearButton = (ev) => {
		ev.preventDefault();
		const btn = ev.target;
		if (btn.classList.contains('option-button--enabled')){
			btn.classList.remove('option-button--enabled');
			schoolYearFilter = schoolYearFilter.filter((filter) => filter !== btn.value);
		} else {
			btn.classList.add('option-button--enabled');
			schoolYearFilter.push(btn.value);
		}
	}

	const applyFilter = (ev) => {
		ev.preventDefault();
		setFilterIcon('filter');
		props.onApply(ev, classFilter, schoolYearFilter);
	}

	return(
		<div 
		className="filter-container"
		>
			<div className="filter-container__header" onClick={(ev) => openFilterContainer(ev)}>
				<H2>Filters</H2>	
				<img className="search-container__filter" src={`./icons/${filterIcon}.svg`} />
			</div>

			<form className="filter-container__filter-body filter-container__filter-body--hide" id={`filter-container__filter-body-${props.position}`}>
				<div className="filter-body__class">
					<H3>Klas</H3>	
					<div className="filter-button-group">
						<OptionButton value="1GDM" onClick={enableClassButton}>1GDM</OptionButton>
						<OptionButton value="2CMO" onClick={enableClassButton}>2CMO</OptionButton>
						<OptionButton value="3CMO" onClick={enableClassButton}>3CMO</OptionButton>
						<OptionButton value="2NMD" onClick={enableClassButton}>2NMD</OptionButton>
						<OptionButton value="3NMD" onClick={enableClassButton}>3NMD</OptionButton>
						<OptionButton value="2AVD" onClick={enableClassButton}>2AVD</OptionButton>
						<OptionButton value="3AVD" onClick={enableClassButton}>3AVD</OptionButton>
						<OptionButton value="2GMB" onClick={enableClassButton}>2GMB</OptionButton>
						<OptionButton value="3GMB" onClick={enableClassButton}>3GMB</OptionButton>
					</div>
				</div>	
				<div className="filter-body__schoolyear">
					<H3>Academiejaar</H3>	
					<div className="filter-button-group">
						<OptionButton value="2019-2020" specifier="schoolyear" onClick={enableSchoolYearButton}>2019-2020</OptionButton>
						<OptionButton value="2020-2021" specifier="schoolyear" onClick={enableSchoolYearButton}>2020-2021</OptionButton>
					</div>
				</div>
				<PrimaryButton onClick={applyFilter}>Apply filter</PrimaryButton>
			</form>
		</div>
	);
}

export default FilterContainer;