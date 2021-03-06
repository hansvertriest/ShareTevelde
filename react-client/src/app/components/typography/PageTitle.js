import { default as React } from 'react';

import './typography.scss';

const PageTitle = (props) => {

	return (
		<h1 className="page-title">
			{props.children}
		</h1>
	);
};

export default PageTitle;