import { default as React, useState, useEffect, useLayoutEffect} from 'react';
import { default as debounce } from 'debounce'; 

import { useApi } from '../services';
import { PostCard } from '../components/postCard';
import './HomePage.scss';

const HomePage = ({children}) => {
	const { getPosts } = useApi();

	const postsLimit = 2;

	const [posts, setPosts] = useState([]);
	console.log('Before postPqge');
	const [postPage, setPostPage] = useState(0);
	const [isFetchingPosts, setIsFetchingPosts] = useState(false);
	const [updatePostPage, setUpdatePostPage] = useState(false);
	
	// loading new posts
	// const loadNextPages = 
	// 	debounce(() => {
	// 		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight ) {
	// 			console.log('--------------')
	// 			loadNewPage();
	// 		}
	// 	}, 250);

	const loadNextPages = () => {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isFetchingPosts) {
			// console.log('--------------')
			// setIsFetchingPosts(true);
			// loadNewPage();
			setUpdatePostPage(true);
		}
	}

	const loadNewPage = () => {
		console.log('page' + postPage + 1);
		setPostPage(postPage + 1);
	}

	// fetching posts

	// set dimensions of pictures

	const setSquareDimensions = () => {
		const pictures = document.getElementsByClassName('post-card__img');
		const elementsAmount = pictures.length;
		for (let i = 0; i < elementsAmount; i++) {
			pictures.item(i).style.height = `${pictures.item(i).offsetWidth}px`;
		}
	}


	// init page

	useLayoutEffect(() => {
		console.log('effect 1')
		
		window.addEventListener('resize', () => {
			setSquareDimensions();
		});

	}, []);

	useEffect(() => {
		console.log('effect 2')
		
		window.addEventListener('scroll', loadNextPages);
		// fetch the posts
		const fetchPosts = async (page) => {
			const docs = await getPosts({}, page, postsLimit);
			const postElements = docs.map((doc) => {
				return <PostCard key={doc._id} id={`post-card__${doc._id}`} postData={doc}/>
			});
			console.log('fetching' + postPage);
			setPosts([...posts ,...postElements]);
			setIsFetchingPosts(false);
			setSquareDimensions();
		}

		fetchPosts(postPage);
	}, [postPage])

	useEffect(() => {
		if (updatePostPage) setPostPage(postPage + 1);
		setUpdatePostPage(false);
	}, [updatePostPage]);



	return (
		<div className="posts-container">
			{posts}
			<div className="loading-text">
				<p>Berichten worden geladen...</p>
				<img src="./icons/loader.svg" als="loading-icon"></img>
			</div>
			<button onClick={() =>loadNewPage()}>Haha</button>
		</div>
  	);
};

export default HomePage;