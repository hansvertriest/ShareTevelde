import { default as React, useState, useEffect, useLayoutEffect} from 'react';

import { useApi } from '../services';
import { PostCard } from '../components/postCard';
import './HomePage.scss';
import { For } from 'react-loops'

const HomePage = ({children}) => {
	const { getPosts } = useApi();

	const postsLimit = 5;


	const [posts, setPosts] = useState([]);
	const [postCards, setPostCards] = useState([]);
	const [postPage, setPostPage] = useState([]);

	
	const fetchPosts = async () => {
		const docs = await getPosts({}, 2, postsLimit);
		setPosts(docs);
	}

	const generateCards = () => {
		const cards = [];
		for( let i = 0; i < postsLimit; i++) {
			cards.unshift(<PostCard key={i} postData={posts[i] || undefined}/>)
		}
		setPostCards(cards);
	}

	useLayoutEffect(() => {
		// fetch the posts
		fetchPosts();

		// generate the empty cards
		generateCards();
	}, [postPage]);

	return (
		<div className="posts-container">
			<For of={posts || []} as={post =>
				<PostCard postData={post}/>
			}/>
		</div>
  	);
};

export default HomePage;