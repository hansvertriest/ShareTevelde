import { default as React, useState, useEffect } from 'react';

import { useApi } from '../services/api.services';
import { apiConfig } from '../config';

import { ProfilePicture, SocialMediaField } from '../components/formComponents';

import './ProfileConfig.scss';

const NewPost = ({children}) => {
	const { userProfile, refreshUserProfile } = useApi();
	

	return (
		<div>
			
		</div>
	);
};

export default NewPost;