import { default as React } from 'react';

import './typography.scss';

const Subtitle = (props) => {

	return (
		<h4 className="subtitle">
			{props.children}
		</h4>
	);
};

export default Subtitle;