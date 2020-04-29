import { default as React, useState, useEffect } from 'react';

import { useApi } from '../services/api.services';
import { useAuth } from '../services/auth.service';
import { ProfilePicture, SocialMediaField } from '../components/formComponents';

const SignUp = ({children}) => {
	const { signUpLocal } = useAuth();
	
	const submitSignUp = async (ev) => {
		ev.preventDefault();
		const email = document.getElementById('signup-email').value;
		const password = document.getElementById('signup-password').value;
		const passwordConfirmation = document.getElementById('signup-password-confirmation').value;
		signUpLocal(email, password, passwordConfirmation, (response) => {
			const errorField = document.getElementById('error-field');
			errorField.innerHTML = response.msg;
		});
	}  

	return (
		<div>
			<form id="signup-form" method="post" action="/auth/signup">
				<input type="text" id="signup-email" name="email"/>
				<input type="text" id="signup-password" name="password"/>
				<input type="text" id="signup-password-confirmation" name="password"/>
				<p id="error-field"></p>
				<button type="submit" onClick={(ev) => submitSignUp(ev)}>SIGNUP</button>
			</form>
		</div>
	);
};

export default SignUp;