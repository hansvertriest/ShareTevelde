import { default as React, useState, useEffect } from 'react';

import { useApi } from '../services/api.services';
import { useAuth } from '../services/api.services';
import { ProfilePicture, SocialMediaField } from '../components/formComponents';

const signUp = ({children}) => {
	const { signup } = useAuth();
	
	const submitSignUp = (ev) => {
		const email = docuemnt.getElementById('email');
		const password = docuemnt.getElementById('password');

		signup(email, password);
	}  

	return (
		<div>
			<form method="post" action="/auth/signup">
				<label for="email">Email</label>
				<input type="text" id="email" name="email"/>
				<label for="password">Email</label>
				<input type="text" id="password" name="password"/>
				<button type="submit" onClick={(ev) => submitSignUp(ev)}>SIGNUP</button>
			</form>
		</div>
	);
};

export default signUp;