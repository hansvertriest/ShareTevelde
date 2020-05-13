import { default as React, useState, useEffect, useLayoutEffect, Fragment} from 'react';

import { useApi, useAuth } from '../services';
import { PostCard } from '../components/postCard';
import { SearchContainer, FilterContainer } from '../components/formComponents';
import { Menu } from '../components/menu'
import './HomePage.scss';

const HomePage = ({children}) => {
	const { getPosts } = useApi();
	const { currentUser, refresh } = useAuth();

	const postsLimit = 2;

	const [posts, setPosts] = useState([]);
	const [postPage, setPostPage] = useState(0);
	const [isFetchingPosts, setIsFetchingPosts] = useState(false);
	const [updatePostPage, setUpdatePostPage] = useState(true); // set to true when next page hast to be loaded
	const [filter, setFilter] = useState(undefined);

	// if scrolled to bottom update postPage
	const checkIfBottomOfPage = () => {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isFetchingPosts) {
			setIsFetchingPosts(true);
			setUpdatePostPage(true);
		}
	}

	// apply filters
	const applyFilters = async (ev, classFilter, schoolYearFilter) => {
		setPosts([]);
		setPostPage(0);
		setFilter({direction: classFilter, schoolyear: schoolYearFilter});
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
		
		// update token 
		if (currentUser) {
			refresh()
		}
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
		}
	}

	useEffect(() => {
		const func = async() => {
			// First if : when filter is first applied.
			// filter can't be used as a condition because the setPostPage will trigger this effect and
			// because of the existence of a filter, the fetchpost will run for a second time. 
			if (filter && postPage === 0) {
				await fetchPosts(postPage);
				setPostPage(postPage + 1);
			} else if (updatePostPage) {
				await fetchPosts(postPage);
				setPostPage(postPage + 1);
				setUpdatePostPage(false);
			}
		}
		func();
	}, [updatePostPage, filter])

	return (
		<div className="page__main-container">
			
			<div className="aside-container aside-container--top">
				{
					(currentUser)
					? <Menu id="menu-top"/>
					: null
				}
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
				{
					(currentUser)
					? <Menu id="menu-right"/>
					: null
				}
				<SearchContainer />
				<FilterContainer onApply={applyFilters} position="right" />
			</div>
		</div>
  	);
};

export default HomePage;