import { default as React } from 'react';

import { Logo } from '../misc';

import './header.scss';

const Header = ({children}) => {
  	return (
		<header className="page__header">
			<Logo />
			<img src='' alt="Profile"/>
		</header>
 	);
};

export default Header;