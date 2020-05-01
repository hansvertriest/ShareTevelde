import { default as React, useState, useEffect } from 'react';

import { useAuth } from '../services';
import { PageTitle } from '../components/typography';
import { InputFieldText, PrimaryButton, SecondaryButton, TertiaryButton } from '../components/formComponents';
import { Logo } from '../components/misc';

import './SignUpIn.scss';

const SignIn = ({children}) => {
	const { signInLocal } = useAuth();
	
	const submitSignIn = async (ev) => {
		ev.preventDefault();

		const email = document.getElementById('signin-email').value;
		const password = document.getElementById('signin-password').value;

		signInLocal(
			email, 
			password, 
			(response) => {
				window.location.href = '/home';
			},
			(response) => {
			const errorField = document.getElementById('error-field');
			errorField.innerHTML = response.msg;
			errorField.style.display = 'block';
		});
	}

	const loginGoogle = async (ev) => {
		ev.preventDefault();
		// reroute
	}


	return (
		<div className="page__signin">
			<Logo margin="20px auto"/>
			<div className="signin__title">
				<PageTitle> Login </PageTitle>
				<TertiaryButton  href='/auth/signup'>Nog geen account?</TertiaryButton>
			</div>
			<form id="signin-form" method="post" action="/auth/signup">
				<InputFieldText 
					id="signin-email" 
					name="email" 
					placeholder="Email"
				/>
				<InputFieldText 
					type="password" 
					id="signin-password" 
					name="password" 
					placeholder="Paswoord"
				/>
				<p className="error-field" id="error-field"></p>
				<TertiaryButton  href="#">Wachtwoord vergeten?</TertiaryButton>
				<div className="signin__button-container">
					<PrimaryButton  onClick={(ev) => submitSignIn(ev)}> Login </PrimaryButton>
					<SecondaryButton  onClick={(ev) => loginGoogle(ev)}> Google </SecondaryButton>
				</div>
			</form>
		</div>
	);
};

export default SignIn;