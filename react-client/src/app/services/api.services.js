import { default as React, useState, useContext, createContext, useEffect } from 'react';

import { apiConfig } from '../config';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const BASE_URL = `${apiConfig.baseURL}`;

  const [userId, setUserId] = useState('5e81f5fae66709437c31577c'); // placeholder
  const [userProfile, setUSerProfile] = useState({});

  useEffect(() => {
    // fetch( `${BASE_URL}/user/${userId}`)
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((json) => {
    //     console.log('dd')
    //     setUSerProfile(json);
    //   })
  }, [userId]);

  const refreshUserProfile = () => {
    console.log(554)
    setUserId(userId);
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
    <ApiContext.Provider value={{userProfile, refreshUserProfile, putTextToMongo, postImageToMongo}}>
      {children}
    </ApiContext.Provider>
  );
};

export {
  ApiContext,
  ApiProvider,
  useApi,
}