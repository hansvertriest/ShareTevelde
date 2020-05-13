import { default as React, useState, useEffect, Fragment } from 'react';

import { Menu } from '../components/menu';
import { PostThumbnail } from '../components/postThumb';
import { useAuth, useApi } from '../services';
import { PageTitle, Subtitle } from '../components/typography';
import './Assignment.scss';

const Assignment = (props) => {
	const { currentUser } = useAuth();
	const { getAssignmentById, getPosts } = useApi();

	const [data, setData] = useState(undefined);
	const [thumbnails, setThumbnails] = useState([]);

	useEffect(() => {
		const func = async () => {
			// fetch course
			const getAssignment = await getAssignmentById(props.match.params[0]);
			if (getAssignment.title) {
				setData(getAssignment);
				// get thumbnails
				const getPostsThumbs = await getPosts({assignment: [getAssignment._id]}, undefined);
				const thumbnailelements = getPostsThumbs.map((post) => {
					return(
						<PostThumbnail key={post._id} postId={post._id} imgName={post.pictures[0].filename} />
					);
				});
				setThumbnails(thumbnailelements);
			} else {
				window.location.href = '/notfound';
			}
		}
		func();
	}, []);
	
	return (
		<div className="page__assignment">
			 <div className="aside-container aside-container--top">
				{
					(currentUser)
					? <Menu id="menu-top"/>
					: null
				}
				
			</div>
			<div className="assignment-container">
				{
					(data)
					? <div className="assignment-container__header">
						<PageTitle>{data.title}</PageTitle>
						<a href={`/course/${data.courseId._id}`}><Subtitle>Vak: {data.courseId.courseTitle}</Subtitle></a>
						<p>{data.description}</p>
					</div>
					: undefined
				}
				<div className="assignment-container__posts">
					{thumbnails}
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

export default Assignment;