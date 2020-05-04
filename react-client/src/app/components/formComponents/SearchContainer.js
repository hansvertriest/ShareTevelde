import { default as React, useState } from 'react';

import { apiConfig } from '../../config';
import { useApi } from '../../services';
import { H3 } from '../typography';
import './SearchContainer.scss';

const SearchContainer = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

	const { getUsers, getAssignments } = useApi();

	const [userResults, setUserResults] = useState(undefined);
	const [assignmentResults, setAssignmentResults] = useState(undefined);
	
	const generateUserResults = (docs) => {
		const elements = docs.map((doc) => {
			return (
				<div className='search-result-user' key={doc._id}>
					<img className='search-result-user__profile-pic' src={`${BASE_URL}/picture/byname/${doc.profile.profilePictureName}`} alt="profile"/>
					<p className='search-result-user__username'>{doc.profile.username}</p>
				</div>
			)
		});
		console.log(elements);
		setUserResults(elements);
	}

	const generateAssignmentResults = (docs) => {
		const elements = docs.map((doc) => {
			return (
				<p className='search-result-assignment__title' key={doc._id}>{doc.title}</p>
			)
		});
		setAssignmentResults(elements);
	}

	const search = async (ev) => {
		if (ev.target.value.length > 0) {
			const value = ev.target.value;

			const users = await getUsers(
				{
					'username:like': value,
				}
			);

			const assignments = await getAssignments(
				{
					'title:like': value,
				}
			);
	
			if (users.length > 0) {
				generateUserResults(users);
			} else {
				setUserResults([undefined]);
			}

			if (assignments.length > 0) {
				generateAssignmentResults(assignments);
			} else {
				setAssignmentResults([undefined]);
			}
		} else {
			setUserResults(undefined);
			setAssignmentResults(undefined)
		}
	}
	return(
		<div 
		className="search-container"
		>
			<input 
			className="search-container__input"
			type="text"
			autoComplete="off"
			placeholder="Zoeken"
			onChange={search}
			>
			</input>
			{
				(userResults || assignmentResults) 
				? 
				<div className="search-results">
					<div className="search-results__users">
						<H3>Gebruikers</H3>	
						{
							(userResults && userResults[0] && userResults.length > 0) 
							? userResults
							: <p className="no-results">Geen gebruikers gevonden.</p>
						}
					</div>
					<div className="search-results__assignments">
						<H3>Opdrachten</H3>	
						{
							(assignmentResults && assignmentResults[0] && assignmentResults.length > 0) 
							? assignmentResults
							: <p className="no-results">Geen opdrachten gevonden.</p>
						}
					</div>
				</div>
				: undefined
			}
		</div>
	);
}

export default SearchContainer;