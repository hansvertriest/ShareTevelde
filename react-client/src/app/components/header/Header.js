import { default as React } from 'react';

import { apiConfig } from '../../config';
import { useAuth } from '../../services';
import { Logo } from '../misc';

import './header.scss';

const Header = ({children}) => {
	const { currentUser } = useAuth();

	const profilePictureUrl = (currentUser && currentUser.profile.profilePictureName) 
		? `${apiConfig.baseURL}/picture/byname/${currentUser.profile.profilePictureName}`
		: './images/defaultProfilePicture.jpg';

  	return (
		<header className="page__header">
			<Logo />
			<img src={profilePictureUrl} alt="Profile"/>
		</header>
 	);
};

export default Header;