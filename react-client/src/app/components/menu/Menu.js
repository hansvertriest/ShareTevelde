import { default as React, useState, useEffect } from 'react';

import { apiConfig } from '../../config';
import { H2 } from '../typography';
import './Menu.scss';
import { useApi } from '../../services';

const Menu = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;
	const { getNotifications } = useApi();

	const [notifications, setNotifications] = useState();

	const fetchNotifications = async () => {
		const notifications = await getNotifications(0, 10, true);
		const notificationsElements = notifications.map((notification) => {
			return(
				<div className="notification" key={notification._id}>
					{
						(notification.type !== 'info') 
						?<img className="notification__img" src={`${BASE_URL}/image/byname/${notification.senderUser.profile.profilePictureName}`} alt="profile"/>
						: null
					}
					<p className="notification__content">{notification.content}</p>
				</div>
			);
		});
		setNotifications(notificationsElements)
	}


	useEffect(() => {
		fetchNotifications();
	}, []);
  	return (
		<div className="menu">
			<div className="menu__actions">
				 <a className="menu-actions__button" href={`/`}>Profiel</a>
				 <a className="menu-actions__button" href={`/`}>Nieuwe post</a>
				 <a className="menu-actions__button" href={`/`}>Profiel bewerken</a>
				 <a className="menu-actions__button" href={`/`}>Privacy</a>
				 <a className="menu-actions__button" href={`/`}>Uitloggen</a>
			</div>
			<div className="menu__divider"></div>
			<div className="menu__notifications">
				{
					(notifications)
					? notifications
					: <p className="menu-notifications__message"></p>
				}
			</div>
			
		</div>
 	);
};

export default Menu;