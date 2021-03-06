import { default as React } from 'react';

import './typography.scss';

const H2 = (props) => {

	return (
		<h2 className="kop-titel">
			{props.children}
		</h2>
	);
};

export default H2;