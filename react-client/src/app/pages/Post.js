import { default as React, useState, useEffect, Fragment } from 'react';

import { useApi, useAuth } from '../services';
import { Menu } from '../components/menu';
import { Feedback } from '../components/feedback';
import { Picture } from '../components/Picture';
import { PageTitle, Subtitle } from '../components/typography';
import { AwesomeButton } from '../components/formComponents';

import './Post.scss';

const Post = (props) => {
	const { getPostById, sendLike, postFeedback, getFeedback } = useApi();
	const { currentUser } = useAuth();

	const [data, setData] = useState(undefined);
	const [pictures, setPictures] = useState(undefined);
	const [hasLiket, setHasLiket] = useState(undefined);
	const [feedback, setFeedback] = useState(undefined);
	const [updateFeedback, setUpdateFeedback] = useState(true);

	const giveLike = async () => {
		await sendLike(data._id)
		.then(() => {
			const newState = !hasLiket;
			setHasLiket(newState);

		});
	}

	const giveFeedback = async (ev) => {
		ev.preventDefault();
		const value = document.getElementById('feedback__input') .value;
		if (value.length > 0) {
			await postFeedback(value, data._id);
			setUpdateFeedback(true)
		}
	}

	useEffect(() => {
		const func = async () => {
			// get post id
			const postId = props.match.params[0];
			if (postId) {
				// get post data
				const getPost = await getPostById(postId);
				if (getPost._id) setData(getPost);

				// set like button
				const liketUsers = getPost.likes.map((like) => like.user)
				if (hasLiket === undefined && liketUsers.includes(currentUser.id)) {
					setHasLiket(true);
				} else if (hasLiket === undefined) {
					setHasLiket(false);
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

	useEffect(() => {
		const func = async () => {
			// get post id
			const postId = props.match.params[0];
			if (updateFeedback) {
				// generate feedback elements
				let feedback = await getFeedback(postId);
				feedback = feedback[0].feedback
				const elements = feedback.map((comment) => {
					return (
						<Feedback key={comment._id} data={comment} onAgree={() => setUpdateFeedback(true)}/>
					);
				});
				setFeedback(elements);
				setUpdateFeedback(false);
			}
		}
		func();
	}, [updateFeedback]);

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
				<div className="feedback-container__feedback">
					<div className="feedback__comments">
						{
						(feedback)
						? feedback
						: <p>Wees de eerste om feedback te geven!</p>
					}
					</div>
					
					<div className="feedback__input-container">
						<div className="feedback__input">
							<input 
								id="feedback__input"
								type="text"
								maxLength="250"
								placeholder="Geef feedback"
							/> 
							<button type="submit"  onClick={giveFeedback}> POST </button>
						</div>
					</div>
					
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