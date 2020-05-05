import { default as React, useState, useEffect } from 'react';

import { apiConfig } from '../../config';
import { PROFILECONFIG, NEWPOST, AUTH_SIGNIN } from '../../routes';
import './Menu.scss';
import { useApi, useAuth } from '../../services';

const Menu = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;
	const { getNotifications } = useApi();
	const { logout } = useAuth();

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
		<div className="menu" id={props.id}>
			<div className="menu__actions">
				 <a className="menu-actions__button" href={`/`}>Profiel</a>
				 <a className="menu-actions__button" href={NEWPOST}>Nieuwe post</a>
				 <a className="menu-actions__button" href={PROFILECONFIG}>Profiel bewerken</a>
				 <a className="menu-actions__button" href={`/`}>Privacy</a>
				 <a className="menu-actions__button" href={AUTH_SIGNIN} onClick={logout}>Uitloggen</a>
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