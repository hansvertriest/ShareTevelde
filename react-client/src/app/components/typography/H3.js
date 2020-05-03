import { default as React } from 'react';

import './typography.scss';

const H3 = (props) => {

	return (
		<h2 className="tussen-titel">
			{props.children}
		</h2>
	);
};

export default H3;