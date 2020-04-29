import { default as React, useState, useEffect } from 'react';

import { useAuth } from '../services/auth.service';
import { PageTitle } from '../components/typography';
import { InputFieldText, PrimaryButton, SecondaryButton, TertiaryButton } from '../components/formComponents';
import { Logo } from '..//components/misc';

import './SignUpInBox.scss';

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

	const goToLogin = async (ev) => {
		ev.preventDefault();
		// reroute
	}

	const registerGoogle = async (ev) => {
		ev.preventDefault();
		// reroute
	}

	const validateEmail = () => {
		return true;
	}

	return (
		<div className="page__signup">
			<Logo margin="20px auto"/>
			<div className="signup__title">
				<PageTitle value="Registreren" />
				<TertiaryButton  onClick={(ev) => goToLogin(ev)}>Al een account?</TertiaryButton>
			</div>
			<form id="signup-form" method="post" action="/auth/signup">
				<InputFieldText 
					id="signup-email" 
					name="email" 
					placeholder="john.doe@email.com"
					validate={() => validateEmail()}
				/>
				<InputFieldText 
					type="password" 
					id="signup-password" 
					name="password" 
					placeholder="Paswoord"
				/>
				<InputFieldText 
					type="password" 
					id="signup-password-confirmation" 
					name="passwordConfirmation" 
					placeholder="Paswoord bevestiging"
				/>
				<p className="error-field" id="error-field"></p>
				<div className="signup__button-container">
					<PrimaryButton  onClick={(ev) => submitSignUp(ev)}> Registreer </PrimaryButton>
					<SecondaryButton  onClick={(ev) => registerGoogle(ev)}> Google </SecondaryButton>
				</div>
			</form>
		</div>
	);
};

export default SignUp;