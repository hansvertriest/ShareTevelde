class ToolBox {
	handleFetchError = (res) => {
		if (res.code) {
			throw {code: res.code, msg: res.msg}; // eslint-disable-line no-throw-literal
		}
		return res;
	}

	parametersToQuery = (url, params, pageParams = undefined) => {
		let query = '?';

		Object.keys(params).forEach((key) => {
			let value = (params[key].length > 1) ? JSON.stringify(params[key]) : params[key] ;
			query = query + `${key}=${value}&`;
		});
		if (pageParams) 
			Object.keys(pageParams).forEach((key) => {
				query = query + `${key}=${pageParams[key]}&`;
			});
		
			query = query.substring(0, query.length - 1);
		return url + query;
	}

	fetchWithStandardOptions = async (url, method, customization) => {
		
		const myHeaders = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
		const options = {
			method: method || 'GET',
			headers: (customization) ? customization.headers : myHeaders,
			body: (customization) ? JSON.stringify(customization.body) : undefined,
			redirect: 'follow',
		};

		return fetch(`${url}`, options);
	}
}

const toolbox = new ToolBox()

export default toolbox;