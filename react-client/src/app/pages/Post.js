import { default as React, useState, useEffect, Fragment } from 'react';

import { useApi, useAuth } from '../services';
import { Menu } from '../components/menu';
import { Feedback } from '../components/feedback';
import { Picture } from '../components/Picture';
import { PageTitle, Subtitle } from '../components/typography';
import { AwesomeButton } from '../components/formComponents';

import './Post.scss';

const Post = (props) => {
	const { getPostById, sendLike, postFeedback, getFeedback, deletePost, sendNotification } = useApi();
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
			// send notification
			if (!hasLiket) sendNotification({
				userId: data.user._id,
				content: `${currentUser.profile.username} vind jouw post awesome.`,
				destinationUrl: `/post/${props.match.params[0]}`,
				type: 'like',
			});
			setHasLiket(newState);
		});
	}

	const giveFeedback = async (ev) => {
		ev.preventDefault();
		// get content
		const value = document.getElementById('feedback__input').value;
		// reset content
		document.getElementById('feedback__input').value = '';
		// upload feedback
		if (value.length > 0) {
			await postFeedback(value, data._id);
			setUpdateFeedback(true);
			// send notification
			sendNotification({
				userId: data.user._id,
				content: `${currentUser.profile.username} heeft jou feedback gegeven!`,
				destinationUrl: `/post/${props.match.params[0]}`,
				type: 'comment',
			});
		}
	}

	const removePost = async () => {
		// eslint-disable-next-line no-restricted-globals
		const conf = confirm('Zeker dat je deze post wil verwijderen?');
		if(conf) {
			await deletePost(data._id);
		}
	}

	useEffect(() => {
		const func = async () => {
			// get post id
			const postId = props.match.params[0];
			if (postId) {
				// get post data
				const getPost = await getPostById(postId);
				if (getPost._id){
					setData(getPost);
				} else {
					window.location.href = "/notfound";
				}
				// set like button
				if (currentUser) {
					const liketUsers = getPost.likes.map((like) => like.user)
					if (hasLiket === undefined && liketUsers.includes(currentUser.id)) {
						setHasLiket(true);
					} else if (hasLiket === undefined) {
						setHasLiket(false);
					}
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
						<Feedback key={comment._id} data={comment} onUpdate={() => setUpdateFeedback(true)}/>
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
				{
					(currentUser && data && data.user._id === currentUser.id)
					? <p className="remove-post" onClick={removePost}>Verwijder deze post<img src="/icons/cross-blue.svg" /> </p>
					:undefined
				}
			</div>

			<div className="post-container">
			{
				(data)
				?
				<Fragment>
					<PageTitle>{data.assignment.title}</PageTitle>
					<Subtitle link={`/profile/${data.user._id}`}>Door {data.user.profile.username}</Subtitle>
					<p className="post-container__assignment-description">{data.assignment.description}</p>
					{pictures}
				</Fragment>
				: undefined
			}
			<div className="post-container__feedback-container">
				{
					(currentUser)
					?
					<div className="feedback-container__like">
						{(data) ? <p className="like-number">{data.likes.length}</p> : undefined}
						<AwesomeButton hasLiket ={hasLiket} onClick={giveLike}/>	
					</div>
					: undefined
				}
				
				<div className="feedback-container__feedback">
					<div className="feedback__comments">
						{
						(feedback)
						? feedback
						: <p>Wees de eerste om feedback te geven!</p>
					}
					</div>
					
					{
					(currentUser) 
					?
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
					:
					undefined
					}
					
					
				</div>
			</div>
			</div>

			<div className="aside-container aside-container--right">
				{
					(currentUser)
					? <Menu id="menu-right"/>
					: null
				}
				
				{
					(currentUser && data && data.user._id === currentUser.id)
					? <p className="remove-post" onClick={removePost}>Verwijder deze post <img src="/icons/cross-blue.svg" /> </p>
					:undefined
				}
			</div>
				
		</div>
	);
};

export default Post;