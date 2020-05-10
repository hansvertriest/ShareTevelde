import { default as React, useEffect } from 'react';

import { apiConfig } from '../../config';
import './PostThumbnail.scss';

const PostThumbnail = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

	useEffect(() => {
		// set dimension
		const element = document.getElementById(`thumbnail-${props.postId}`);
		element.style.height = `${element.offsetWidth}px`;
		console.log('ss')

	}, []);
  	return (
		<a href={`/post/${props.postId}`} id={`thumbnail-${props.postId}`} className="post-thumbnail" >
			<img src={`${BASE_URL}/image/byname/${props.imgName}`} alt="thumbnail" />
		</a>
 	);
};

export default PostThumbnail;