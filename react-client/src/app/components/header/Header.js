import { default as React, Fragment } from 'react';

import { apiConfig } from '../../config';
import { useAuth } from '../../services';
import { Logo } from '../misc';
import { TertiaryButton } from '../formComponents';

import './header.scss';

const Header = ({children}) => {
	const { currentUser } = useAuth();

	const profilePictureUrl = (currentUser && currentUser.profile.profilePictureName) 
		? `${apiConfig.baseURL}/picture/byname/${currentUser.profile.profilePictureName}`
		: './images/defaultProfilePicture.jpg';

  	return (
		<header className="page__header">
		<Logo />
			{				
				(currentUser) 
				?
					<Fragment>
						<img src={profilePictureUrl} alt="Profile"/>
					</Fragment>
				: 
					<p>
						<TertiaryButton href="/auth/signup">Registreren</TertiaryButton> | <TertiaryButton href="/auth/signin">Login</TertiaryButton>
					</p>
			}
		</header>
 	);
};

export default Header;