import { default as React } from 'react';

import { useAuth } from '../services';
import { PageTitle } from '../components/typography';
import { InputFieldText, PrimaryButton, SecondaryButton, TertiaryButton } from '../components/formComponents';
import { AUTH_SIGNIN } from '../routes';
import { Logo } from '../components/misc';

import './SignUpIn.scss';

const SignUp = ({children}) => {
	const { signUpLocal, googleAuth } = useAuth();
	
	const submitSignUp = async (ev) => {
		ev.preventDefault();
		
		const email = document.getElementById('signup-email').value;
		const password = document.getElementById('signup-password').value;
		const passwordConfirmation = document.getElementById('signup-password-confirmation').value;

		await signUpLocal(
			email, 
			password,
			passwordConfirmation,
			(response) => {

			},
			(response) => {
			const errorField = document.getElementById('error-field');
			errorField.innerHTML = response.msg;
			errorField.style.display = 'block';
		})
			.then((repsonse) => {
				window.location.href = "/profileconfig";
			})
	}

	const registerGoogle = async (ev) => {
		ev.preventDefault();
		googleAuth();
	}

	const validateEmail = (ev) => {
		// eslint-disable-next-line no-useless-escape
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(String(ev.target.value).toLowerCase()) && ev.target.value.length > 0) {
			return {
				passed: true,
			}
		} else if (ev.target.value.length > 0) {
			return {
				passed: false,
				error: 'Gelieve een geldige email op te geven.'
			}
		}
		return false;
	}

	const validatePassword = (ev) => {
		if (ev.target.value.length >= 10 && ev.target.value.length > 0) {
			return {
				passed: true,
			}
		} else if (ev.target.value.length > 0) {
			return {
				passed: false,
				error: 'Paswoord moet minstens 10 tekens bevatten.'
			}
		}
		return false;
	}

	const validatePasswordConfirmation = (ev) => {
		const password = document.getElementById('signup-password').value;
		if (ev.target.value === password && ev.target.value.length > 0 ) {
			return {
				passed: true,
			}
		} else if (ev.target.value.length > 0) {
			return {
				passed: false,
				error: 'Paswoorden zijn niet hetzelfde.',
			}
		}
		return false;
	}

	return (
		<div className="page__signup">
			<Logo margin="20px auto"/>
			<div className="signup__title">
				<PageTitle> Registreer </PageTitle>
				<TertiaryButton href='/auth/signin' >Al een account?</TertiaryButton>
			</div>
			<form id="signup-form" method="post" action={AUTH_SIGNIN}>
				<InputFieldText 
					id="signup-email" 
					name="email" 
					placeholder="Email"
					validate={(ev) => validateEmail(ev)}
					showErrors={true}
				/>
				<InputFieldText 
					type="password" 
					id="signup-password" 
					name="password" 
					placeholder="Paswoord"
					validate={(ev) => validatePassword(ev)}
					showErrors={true}
				/>
				<InputFieldText 
					type="password" 
					id="signup-password-confirmation" 
					name="passwordConfirmation" 
					placeholder="Paswoord bevestiging"
					validate={(ev) => validatePasswordConfirmation(ev)}
					showErrors={true}
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