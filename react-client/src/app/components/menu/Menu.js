import { default as React, useState } from 'react';

import { apiConfig } from '../../config';
import { H2 } from '../typography';
import './Menu.scss';
import { useApi } from '../../services';

const Menu = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;
	const { getNotifications } = useApi();

	const [notifications, setNotifications] = useState();

	const fetchNotifications = async () => {
		const getNotificationsnotificqtions = await getNotifications({}, 0, 10);
	}

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