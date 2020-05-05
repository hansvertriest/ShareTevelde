import { default as React, Fragment } from 'react';

import { apiConfig } from '../../config';
import { useAuth } from '../../services';
import { Logo } from '../misc';
import { TertiaryButton } from '../formComponents';

import './header.scss';

const Header = ({children}) => {
	const { currentUser } = useAuth();

	const profilePictureUrl = (currentUser && currentUser.profile.profilePictureName) 
		? `${apiConfig.baseURL}/image/byname/${currentUser.profile.profilePictureName}`
		: './images/defaultProfilePicture.jpg';

	const toggleMenu = () => {
		const menu = document.getElementById('menu-top');
		if (menu.classList.contains('menu-top--show')) {
			menu.classList.remove('menu-top--show');
		} else {
			menu.classList.add('menu-top--show');
		}
	}

  	return (
		<header className="page__header">
		<Logo />
			{				
				(currentUser) 
				?
					<Fragment>
						<img src={profilePictureUrl} alt="Profile" onClick={toggleMenu}/>
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