import { default as React, useState } from 'react';

import { apiConfig } from '../../config';
import { H2 } from '../typography';
import './Menu.scss';

const Menu = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

  	return (
		<div className="menu">
			<div className="menu__actions">
				 <a className="menu-actions__button" href={`/`}>Profiel</a>
				 <a className="menu-actions__button" href={`/`}>Nieuwe post</a>
				 <a className="menu-actions__button" href={`/`}>Profiel bewerken</a>
				 <a className="menu-actions__button" href={`/`}>Privacy</a>
				 <a className="menu-actions__button" href={`/`}>Uitloggen</a>
			</div>
			<span className="menu__divider"></span>
			<div className="menu__notifications">

			</div>
			
		</div>
 	);
};

export default Menu;