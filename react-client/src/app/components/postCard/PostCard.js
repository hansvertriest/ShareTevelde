import { default as React, useState, useEffect } from 'react';

import { apiConfig } from '../../config';
import './PostCard.scss';

const PostCard = (props) => {
	const BASE_URL = `${apiConfig.baseURL}`;

	const [data, setData] = useState(props.postData);

	useEffect(() => {
		console.log(data);
	}, [data]);

  	return (
		<div className="post-card">
			<div className="post-card__img" > 
				<img 
				src={(data)
					? `${BASE_URL}/picture/byname/${data.pictures[0].filename}`
					: ''
				}
				alt="Post"
				></img>
			</div>
			<div className="post-card__info">
		
			</div>
		</div>
 	);
};

export default PostCard;