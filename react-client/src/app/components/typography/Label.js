import { default as React } from 'react';

import './typography.scss';

const Label = (props) => {

	return (
		<h2 className="label">
			{props.children}
		</h2>
	);
};

export default Label;