import { default as React, useState, useEffect } from 'react';

import './typography.scss';

const PageTitle = (props) => {

	return (
		<h1 className="page-title">
			{props.value}
		</h1>
	);
};

export default PageTitle;