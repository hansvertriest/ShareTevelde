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
			localStorage.setItem('mern:authUser', query.replace('?token=', ''));
			window.location.href="/profileconfig"
		}

		func();
	});
	return (
		<Fragment></Fragment>
	)
}

export default GoogleCallback;