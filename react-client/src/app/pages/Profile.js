import { default as React, useEffect, useState, Fragment } from 'react';

import { useAuth, useApi } from '../services';
import { apiConfig } from '../config';

import { Menu } from '../components/menu';
import { SocialMediumButton } from '../components/misc'
import { PostThumbnail } from '../components/postThumb';

import './Profile.scss';

const Profile = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

	const { getPostsOfUser } = useApi();

	const { getUserById, socialMediums } = useApi();
	const { currentUser } = useAuth();

	const [user, setUser] = useState(undefined);
	const [socialMediaButtons, setSocialMediaButtons] = useState([]);
	const [postThumbnails, setPostThumbnails] = useState([]);

	useEffect(() => {
		const func = async () => {
			// get user id
			const userId = props.match.params[0];
			if (userId) {
				const getUser = await getUserById(userId);
				if (getUser.profile) setUser(getUser);
				console.log(getUser);
				
				// create social media buttons
				const profileKeys = Object.keys(getUser.profile);
				const buttons = [];
				profileKeys.forEach((key) => {
					const imgName = key.replace('link', '');
					if (socialMediums.includes(key)) {
						buttons.push(
							<SocialMediumButton 
								key={key} 
								url={getUser.profile[key]} 
								imgName={imgName}
							/>
						)
					}
				});
				setSocialMediaButtons(buttons);

				// create post thumbnails
				const posts = await getPostsOfUser(getUser._id);
				const postElements = posts.map((post) => {
					return (
						<PostThumbnail postId={post._id} key={post._id} imgName={post.pictures[0].filename} />
					)
				});
				setPostThumbnails(postElements);
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
			(user)
			?
			<Fragment>
				<div className="profile-container__picture-section">
					<img className="picture-section__picture" src={`${BASE_URL}/image/byname/${user.profile.profilePictureName}`} alt="profile"/>
					<div className="picture-section__description">
						<div className="username-container"><p className="username">{user.profile.username}</p></div>
						<p className="description">{user.profile.profileDescription}</p>
					</div>
				</div>
				<div className="profile-container__social-media">
					{socialMediaButtons}
				</div>
				<div className="profile-container__posts">
					{postThumbnails}
				</div>
			</Fragment>
			: undefined
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