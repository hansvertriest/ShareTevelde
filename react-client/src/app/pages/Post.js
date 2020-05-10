import { default as React, useState, useEffect, Fragment } from 'react';

import { useApi, useAuth } from '../services';
import { toolBox } from '../utilities'
import { Menu } from '../components/menu';
import { Picture } from '../components/Picture';
import { PageTitle, Subtitle } from '../components/typography';
import { SearchContainer, FilterContainer, UploadPicture } from '../components/formComponents';
import { AwesomeButton } from '../components/formComponents';

import './Post.scss';

const Post = (props) => {
	const { getPostById, sendLike } = useApi();
	const { currentUser } = useAuth();

	const [data, setData] = useState(undefined);
	const [pictures, setPictures] = useState(undefined);
	const [hasLiket, setHasLiket] = useState(undefined);

	const refresh = () => {
		
	}

	const giveLike = async () => {
		await sendLike(data._id);
		const newState = !hasLiket;
		setHasLiket(newState);
	}

	useEffect(() => {
		const func = async () => {
			// get post id
			const postId = props.match.params[0];
			if (postId) {
				// get post data
				const getPost = await getPostById(postId);
				if (getPost._id) setData(getPost);
				console.log(getPost);

				// set like button
				const liketUsers = getPost.likes.map((like) => like.user)
				if (hasLiket === undefined && liketUsers.includes(currentUser.id)) {
					setHasLiket(true)
				}

				// create picture elements
				const pictureElements = getPost.pictures.map((picture) => {
					return (
						<Picture data={picture} id={picture._id} key={picture._id}/>
					)
				});
				setPictures(pictureElements);

			}
		}

		func();
	}, [hasLiket]);

	return (
		<div className="page__post">
			<div className="aside-container aside-container--top">
				{
					(currentUser)
					? <Menu id="menu-top"/>
					: null
				}
			</div>

			<div className="post-container">
			{
				(data)
				?
				<Fragment>
					<PageTitle>{data.assignment.title}</PageTitle>
					<Subtitle>Door {data.user.profile.username}</Subtitle>
					<p className="post-container__assignment-description">{data.assignment.description}</p>
					{pictures}
				</Fragment>
				: undefined
			}
			<div className="post-container__feedback-container">
				<div className="feedback-container__like">
					{(data) ? <p className="like-number">{data.likes.length}</p> : undefined}
					<AwesomeButton hasLiket ={hasLiket} onClick={giveLike}/>	
				</div>
			</div>
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

export default Post;