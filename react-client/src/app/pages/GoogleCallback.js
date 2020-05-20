import { default as React, Fragment, useEffect } from 'react';

import { apiConfig } from '../config';
import { toolBox } from '../utilities';;

const GoogleCallback = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;
	// get query 
	console.log(window.location.search);
	useEffect(() => {
		const func = async () => {
			const query = window.location.search;
			const user = await toolBox.fetchWithStandardOptions(`${BASE_URL}/auth/google/callback${query}`, 'GET');
			console.log(user)
			localStorage.setItem('mern:authUser', user.token);
		}

		func();
	});
	return (
		<Fragment></Fragment>
	)
}

export default GoogleCallback;