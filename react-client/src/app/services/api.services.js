import { default as React, useState, useContext, createContext } from 'react';

import { apiConfig } from '../config';
import { toolBox } from '../utilities';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const BASE_URL = `${apiConfig.baseURL}`;
  const socialMediums = ['linkFb', 'linkInsta', 'linkTwitter', 'linkYt', 'linkVimeo'];
//  OLD=================
  const [userId, setUserId] = useState('5e81f5fae66709437c31577c'); // placeholder
  const [userProfile] = useState({});

//   useEffect(() => {
//     fetch( `${BASE_URL}/user/${userId}`)
//       .then((res) => {
//         return res.json();
//       })
//       .then((json) => {
//         console.log('dd')
//         setUSerProfile(json);
//       })
//   }, [userId]);

  const refreshUserProfile = () => {
    setUserId(userId);
  }
// =====================
	// POSTS functions
	const getPosts = async (filters, pageNr, limit, filtered = false) => {
		// construct query
		const url = (filtered) ? `${BASE_URL}/post/all/filtered` : `${BASE_URL}/post/all`;
		const queryUrl = toolBox.parametersToQuery(url, filters, (pageNr !== undefined && limit !== undefined) ? { pageNr, limit } : undefined);
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(queryUrl, 'GET');
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const createPost = async ( assignmentId, urlToProject, pictures) => {
		const url = `${BASE_URL}/post`;
		// create body 
		const body = {
			assignmentId,
			urlToProject,
			pictures,
		}
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(url, 'POST', {body}, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const deletePost = async (postId) => {
		const url = `${BASE_URL}/post/own`;
		// create body 
		const body = {
			id: postId
		}
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(url, 'DELETE', {body}, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const getPostsOfUser = async (userId) => {
		// construct query
		const url = `${BASE_URL}/post/all`;
		const queryUrl = toolBox.parametersToQuery(url, {user: [userId]});
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(queryUrl, 'GET');
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const getPostById = async (id) => {
		// construct url
		const url = `${BASE_URL}/post/`;
		const queryUrl = toolBox.parametersToQuery(url, {id:[id]});

		// fetch users
		const response = await toolBox.fetchWithStandardOptions(queryUrl, 'GET', {});
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const postFeedback = async (content, postId) => {
		const url = `${BASE_URL}/post/feedback`;
		// create body 
		const body = {
			content,
			postId
		}
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(url, 'POST', {body}, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const deleteFeedback = async (feedbackId) => {
		const url = `${BASE_URL}/post/feedback`;
		// create body 
		const body = {
			feedbackId
		}
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(url, 'DELETE', {body}, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const getFeedback = async (postId) => {
		// construct url
		const url = `${BASE_URL}/post/feedback`;
		const queryUrl = toolBox.parametersToQuery(url, {id:[postId]});

		// fetch users
		const response = await toolBox.fetchWithStandardOptions(queryUrl, 'GET', {});
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const postAgree = async (feedbackId) => {
		const url = `${BASE_URL}/post/feedback/agree`;
		// create body 
		const body = {
			id: feedbackId,
		}
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(url, 'POST', {body}, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	// USERS functions
	const getUsers = async (filters, pageNr, limit) => {
		// construct query
		const url = `${BASE_URL}/user/all`;
		const queryUrl = toolBox.parametersToQuery(url, filters, (pageNr !== undefined && limit !== undefined) ? { pageNr, limit } : undefined);
		// fetch users
		const response = await toolBox.fetchWithStandardOptions(queryUrl, 'GET');
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const updateUser = async (body) => {
		const url = `${BASE_URL}/user/token`;
		// fetch users
		const response = await toolBox.fetchWithStandardOptions(url, 'PUT', {body},true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const getUserById = async (id) => {
		// construct url
		const url = `${BASE_URL}/user/`;
		const queryUrl = toolBox.parametersToQuery(url, {id:[id]});

		// fetch users
		const response = await toolBox.fetchWithStandardOptions(queryUrl, 'GET', {});
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	// ASSIGNMENTS functions
	const getAssignments = async (filters, pageNr, limit) => {
		// construct query
		const url = `${BASE_URL}/assignment/all`;
		const queryUrl = toolBox.parametersToQuery(url, filters, (pageNr !== undefined && limit !== undefined) ? { pageNr, limit } : undefined);
		// fetch assignments
		const response = await toolBox.fetchWithStandardOptions(queryUrl, 'GET');
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const createNewAssignment = async (courseId, title, description ) => {
		const url = `${BASE_URL}/assignment`;

		const body = {
			courseId,
			title,
			description,
		}	

		const response = await toolBox.fetchWithStandardOptions(url, 'POST', {body}, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	// COURSES functions
	const getCourses = async (filters, pageNr, limit) => {
		// construct query
		const url = `${BASE_URL}/course/all`;
		const queryUrl = toolBox.parametersToQuery(url, filters, (pageNr !== undefined && limit !== undefined) ? { pageNr, limit } : undefined);
		// fetch courses
		const response = await toolBox.fetchWithStandardOptions(queryUrl, 'GET');
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const createNewCourse = async (courseTitle, schoolyear, direction) => {
		const url = `${BASE_URL}/course`;

		const body = {
			courseTitle,
			schoolyear,
			direction
		}	

		const response = await toolBox.fetchWithStandardOptions(url, 'POST', {body}, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	// NOTIFICATIONS functions
	const getNotifications = async (pageNr, limit, attachToken) => {
		// construct query
		const url = `${BASE_URL}/notification/all`;
		const queryUrl = toolBox.parametersToQuery(url, {}, (pageNr !== undefined && limit !== undefined) ? { pageNr, limit } : undefined);
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(queryUrl, 'GET', undefined, attachToken);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	const sendNotification = async (notification) => {
		// construct query
		const url = `${BASE_URL}/notification`;
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(url, 'POST', {body: notification}, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}

	// PICTURES functions
  	const uploadImage = async ( formData ) => {
		const url = `${apiConfig.baseURL}/image`;
		const response = await toolBox.fetchWithStandardOptionsImage(url, 'POST', formData, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	  }
	  
	  const uploadPictureWithFilename = async ( title, description, filename ) => {
		const url = `${BASE_URL}/picture/filename`;

		const body = {
			title,
			description,
			filename,
		}	

		const response = await toolBox.fetchWithStandardOptions(url, 'POST', {body}, true);
		return response.json()
			.then((res) => {
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
  	}

	// MISC functions
	const sendLike = async (postId) => {
		// construct query
		const url = `${BASE_URL}/post/like`;
		// fetch posts
		const response = await toolBox.fetchWithStandardOptions(url, 'POST', {body: {id: postId}}, true);
		return response.json()
			.then((res) => {
				console.log(res);
				return toolBox.handleFetchError(res);
			})
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log(error);
				return error;
			})
	}


  	return (
    	<ApiContext.Provider value={{
			userProfile,
			refreshUserProfile, 
			updateUser, 
			getUserById,
			uploadImage,
			uploadPictureWithFilename,
			getPosts,
			getPostsOfUser,
			createPost,
			deletePost,
			getPostById,
			postFeedback,
			deleteFeedback,
			getFeedback,
			postAgree,
			getUsers,
			getAssignments,
			getNotifications,
			sendNotification,
			getCourses,
			createNewCourse,
			createNewAssignment,
			socialMediums,
			sendLike,
			}}>
      	{children}
    	</ApiContext.Provider>
  	);
};

export {
  	ApiContext,
  	ApiProvider,
  	useApi,
}