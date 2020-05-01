import { default as React } from 'react';

import './typography.scss';

const KopTitel = (props) => {

	return (
		<h2 className="kop-titel">
			{props.children}
		</h2>
	);
};

export default KopTitel;