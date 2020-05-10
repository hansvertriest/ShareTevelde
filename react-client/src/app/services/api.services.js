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

  	const putTextToMongo = ( formData, apiUrl ) => {
    	return fetch( `${BASE_URL}/${apiUrl}`, {
        	method: 'put',
        	body: formData,
        	headers: { encType: 'multipart/form-data' },
     	 }).then((res) => {
        	return res.json();
      	});
  	}


  	return (
    	<ApiContext.Provider value={{
			userProfile,
			refreshUserProfile, 
			updateUser, 
			getUserById,
			putTextToMongo, 
			uploadImage,
			uploadPictureWithFilename,
			getPosts,
			getPostsOfUser,
			createPost,
			getUsers,
			getAssignments,
			getNotifications,
			sendNotification,
			getCourses,
			createNewCourse,
			createNewAssignment,
			socialMediums,
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