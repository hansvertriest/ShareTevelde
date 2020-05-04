import { default as React, useState, useEffect, useLayoutEffect, Fragment} from 'react';

import { useApi } from '../services';
import { PostCard } from '../components/postCard';
import { SearchContainer, FilterContainer } from '../components/formComponents';
import './HomePage.scss';

const HomePage = ({children}) => {
	const { getPosts } = useApi();

	const postsLimit = 2;

	const [posts, setPosts] = useState([]);
	const [postPage, setPostPage] = useState(0);
	const [isFetchingPosts, setIsFetchingPosts] = useState(false);
	const [updatePostPage, setUpdatePostPage] = useState(true); // set to true when next page hast to be loaded
	const [filter, setFilter] = useState(undefined);

	// if scrolled to bottom update postPage
	const checkIfBottomOfPage = () => {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isFetchingPosts) {
			setUpdatePostPage(true);
		}
	}

	// apply filters
	const applyFilters = async (ev, classFilter, schoolYearFilter) => {
		setPosts([]);
		setPostPage(0);
		setFilter({direction: classFilter, schoolyear: schoolYearFilter});
	}

	// set dimensions of pictures
	const setSquareDimensions = () => {
		const pictures = document.getElementsByClassName('post-card__img');
		const elementsAmount = pictures.length;
		for (let i = 0; i < elementsAmount; i++) {
			pictures.item(i).style.height = `${pictures.item(i).offsetWidth}px`;
		}
	}

	const updateLoadingText = (text) => {
		const element = document.querySelector('.loading-text p');
		element.innerHTML = text;
		
		const iconElement = document.querySelector('.loading-text img');
		if (iconElement) iconElement.style.display = 'none';
	}

	// init page

	useLayoutEffect(() => {
		// listener for checking if bottom of page
		window.addEventListener('scroll', checkIfBottomOfPage);
		
		// listener for setting square dimensions
		window.addEventListener('resize', () => {
			setSquareDimensions();
		});

	}, []);

	// Fetch posts when the page is updated

	const fetchPosts = async (page) => {
		// get docs
		const docs = (filter) ?  await getPosts(filter, page, postsLimit, true) : await getPosts({}, page, postsLimit) ;

		// if no posts were found 
		if(docs.code === 404) {
			updateLoadingText('Geen berichten gevonden om te tonen.');
		} else if (docs.code) {
			updateLoadingText('Oepsiepoepsie! Er is een fout opgetreden tijden het ophalen van de berichten.');
		} else {
			// construct jsx elements
			const postElements = docs.map((doc) => {
				return <PostCard key={doc._id} id={`post-card__${doc._id}`} postData={doc}/>
			});

			// update elements
			if (filter && postPage === 0) {
				setPosts([...postElements]);
			} else {
				setPosts([...posts ,...postElements]);
			}

			// conclude fetching
			setIsFetchingPosts(false);

			// set dimensions of new posts
			setSquareDimensions();
		}
	}

	// useEffect(() => {
	// 	fetchPosts(postPage);
	// }, [postPage])

	useEffect(() => {
		if (filter) {
			fetchPosts(postPage);
		} else if (postPage) {
			fetchPosts(postPage);
		}
	}, [postPage, filter])

	// update page when updatePostPage is set to true
	useEffect(() => {
		if (updatePostPage) {
			setPostPage(postPage + 1);
		}
		setUpdatePostPage(false);
	}, [updatePostPage]);

	return (
		<div className="page__main-container">
			
			<div className="aside-container aside-container--top">
				<SearchContainer />
				<FilterContainer onApply={applyFilters} position="top" />
			</div>
			<div className="posts-container">
				{posts}
				<div className="loading-text">
					{(posts.length > 0)
					?
						<Fragment>
							<p>Berichten worden geladen...</p>
							<img src="./icons/loader.svg" alt="loading-icon"></img>
						</Fragment>
					:
						<p>Geen berichten om te tonen.</p>
					}
					
				</div>
			</div>
			<div className="aside-container aside-container--right">
				<SearchContainer />
				<FilterContainer onApply={applyFilters} position="right" />
			</div>
		</div>
  	);
};

export default HomePage;