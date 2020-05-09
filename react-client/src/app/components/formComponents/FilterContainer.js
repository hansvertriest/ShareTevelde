import { default as React, useState, useEffect } from 'react';

import { H2, H3 } from '../typography';
import { OptionButton, PrimaryButton } from '../formComponents';
import './FilterContainer.scss';

const FilterContainer = (props) => {
	const [filterIcon, setFilterIcon] = useState('filter-disabled');
	const [classFilter, setClassFilter] = useState([]);
	const [schoolYearFilter, setSchoolYearFilter] = useState([]);

	// when filter is clicked open the container
	const openFilterContainer = (ev) => {
		const filters = document.getElementById(`filter-container__filter-body-${props.position}`);
		if (filters.classList.contains('filter-container__filter-body--hide')){
			filters.classList.remove('filter-container__filter-body--hide');
		} else {
			filters.classList.add('filter-container__filter-body--hide');
		}
	}

	// when 'richting' option button is clicked
 	const enableClassButton = (ev) => {
		ev.preventDefault();
		const btn = ev.target;
		if (btn.classList.contains('option-button--enabled')){
			btn.classList.remove('option-button--enabled');
			setClassFilter(classFilter.filter((filter) => filter !== btn.value));
		} else {
			btn.classList.add('option-button--enabled');
			setClassFilter([...classFilter, btn.value]);
		}
		
	}

	// when 'academiejaar' option button is clicked
	const enableSchoolYearButton = (ev) => {
		ev.preventDefault();
		const btn = ev.target;
		if (btn.classList.contains('option-button--enabled')){
			btn.classList.remove('option-button--enabled');
			console.log(schoolYearFilter)
			setSchoolYearFilter(schoolYearFilter.filter((filter) => filter !== btn.value));
		} else {
			btn.classList.add('option-button--enabled');
			setSchoolYearFilter([...schoolYearFilter, btn.value]);
			console.log(schoolYearFilter)
		}
	}

	// when apply button is clicked
	const applyFilter = (ev) => {
		ev.preventDefault();
		setFilterIcon('filter');
		props.onApply(ev, classFilter, schoolYearFilter);

	}

	useEffect(() => {
	}, [schoolYearFilter]);

	return(
		<div 
		className="filter-container"
		>
			<div className="filter-container__header" onClick={(ev) => openFilterContainer(ev)}>
				<H2>Filters</H2>	
				<img className="search-container__filter" src={`./icons/${filterIcon}.svg`} alt="filter icon" />
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