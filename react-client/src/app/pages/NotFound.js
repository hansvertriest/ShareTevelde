import { default as React } from 'react';


import {PageTitle} from '../components/typography';
import './NotFound.scss';

const NotFound = (props) => {
	
	return (
		<div className="not-found">
			<PageTitle>404 Not Found</PageTitle>
			<p onClick={()=> {window.history.go(-2)}}>Terug</p>
		</div>
	);
};

export default NotFound;