import { default as React, useEffect, useState } from 'react';

import { useAuth, useApi } from '../services';
import { PageTitle } from '../components/typography';
import { Menu } from '../components/menu';
import { InputFieldText, PrimaryButton, SecondaryButton, TertiaryButton } from '../components/formComponents';
import { AUTH_SIGNUP } from '../routes';
import { Logo } from '../components/misc';

import './Profile.scss';

const Profile = (props) => {
	const { getUserById } = useApi();
	const { currentUser } = useAuth();

	const [profile, setProfile] = useState(undefined);

	useEffect(() => {
		const func = async () => {
			// get user id
			const profileId = props.match.params[0];
	
			if (profileId) {
				const getProfile = await getUserById(profileId);
				if (getProfile.profile) setProfile(getProfile);
			}
		}
		
		func();
	}, []);	

	return (
		<div className="page__profile">
			
			<div className="aside-container aside-container--top">
				{
					(currentUser)
					? <Menu id="menu-top"/>
					: null
				}
			</div>
			<div className="profile-container">
			{
				(profile)
				? 
				<div></div>
				: 
				<p>Oeps hier is niets te zien!</p>
			}

			</div>
			
			<div className="aside-container aside-container--right">
				{
					(currentUser)
					? <Menu id="menu-right"/>
					: null
				}
			</div>
		</div>
	);
};

export default Profile;