import { default as React, useState, useContext, createContext } from 'react';

import { apiConfig } from '../config';
import { toolBox } from '../utilities';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const BASE_URL = `${apiConfig.baseURL}`;
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

	// NOTIFICaTIONS functions
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

  	const putTextToMongo = ( formData, apiUrl ) => {
    	return fetch( `${BASE_URL}/${apiUrl}`, {
        	method: 'put',
        	body: formData,
        	headers: { encType: 'multipart/form-data' },
     	 }).then((res) => {
        	return res.json();
      	});
  	}

  	const postImageToMongo = ( formData ) => {
    	return fetch(`${apiConfig.baseURL}/pictures`, {
			method: 'post',
			body: formData,
			headers: { encType: 'multipart/form-data' },
		}).then((res) => {
			return res.json();
		})
  	}


  	return (
    	<ApiContext.Provider value={{
			userProfile, 
			refreshUserProfile, 
			putTextToMongo, 
			postImageToMongo,
			getPosts,
			getUsers,
			getAssignments,
			getNotifications,
			getCourses,
			createNewCourse,
			createNewAssignment,
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