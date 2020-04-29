import { default as React, useState, useEffect } from 'react';

import './logo.scss';

const Logo = (props) => {
	const size = props.size || undefined;
	const margin = props.margin || undefined;
	return (
		<p className="logo" style={{fontSize: size, margin,}}><span>Share</span>Tevelde</p>
	);
};

export default Logo;