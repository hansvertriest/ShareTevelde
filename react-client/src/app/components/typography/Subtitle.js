import { default as React, Fragment } from 'react';

import './typography.scss';

const Subtitle = (props) => {

	return (
		<Fragment>
		{
			(props.link)
			?
			<a  href={props.link} className="subtitle">
				{props.children}
			</a>
			:
			<h4 className="subtitle">
				{props.children}
			</h4>
		}
		</Fragment>
	);
};

export default Subtitle;