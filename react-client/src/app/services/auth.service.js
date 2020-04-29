import React, {
	createContext,
	useContext,
	useState
} from 'react';
import * as jwt from 'jsonwebtoken';
import {
	apiConfig
} from '../config';
import {
	toolBox
} from '../utilities/';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({
	children
}) => {

	// Add verification trough api instead! api/auth/verify/:token
	const verifyUserFromLocalStorage = () => {
		if (JSON.parse(localStorage.getItem('mern:authUser'))) {
			try {
				const token = JSON.parse(localStorage.getItem('mern:authUser')).token;
				if (!token) {
					throw new Error('Token is not present on localstorage!');
				}
				const decoded = jwt.verify(token, apiConfig.jwtSecret);
				if (!decoded) {
					throw new Error('Couldn\'t decode the token!');
				}
				if (decoded.exp > Date.now()) {
					throw new Error('Token is expired!')
				}
				return JSON.parse(localStorage.getItem('mern:authUser'));
			} catch (error) {
				return null;
			}
		}
		return null;
	}

	const [currentUser, setCurrentUser] = useState(verifyUserFromLocalStorage);

	const signInLocal = async (email, password) => {
		const url = `${apiConfig.baseURL}/auth/signin`;

		const body = {
			email,
			password
		};

		const myHeaders = {
			// 'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
		const options = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: 'follow'
		};

		const response = await fetch(`${url}`, options);
		const user = await response.json();

		localStorage.setItem('mern:authUser', JSON.stringify(user));
		setCurrentUser(user);

		return user;
	}

	const signUpLocal = async (email, password, passwordConfirmation, cb) => {
		let url = `${apiConfig.baseURL}/auth/signup`;

		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);

		const body = {
			email,
			password,
			passwordConfirmation,
		};

		const myHeaders = {
			'Content-Type': 'application/json',
		}

		const options = {
			method: 'post',
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: 'follow'
		};

		const response = await fetch(`${url}`, options);
		const user = await response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((response) => {
				localStorage.setItem('mern:authUser', JSON.stringify(response.token));
				setCurrentUser(response);
			})
			.catch((error) => {
				cb(error);
			})
	}

	const logout = async () => {
		localStorage.setItem('mern:authUser', null);
		return true;
	}

	return ( <AuthContext.Provider value = {
			{
				currentUser,
				signInLocal,
				signUpLocal,
				logout
			}
		} > {
			children
		} </AuthContext.Provider>
	)
};

export {
	AuthContext,
	AuthProvider,
	useAuth,
}