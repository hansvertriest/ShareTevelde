import { default as React } from 'react';
import { Route as ReactRoute } from 'react-router';

const renderMergedProps = (component, layout, routeProps) => {
  return (layout) ? React.createElement(layout, routeProps, React.createElement(component, routeProps)) : React.createElement(component, routeProps);
};

const RouteWithLayout = ({ component, layout, ...rest }) => {
  return (
    <ReactRoute {...rest} render={routeProps => {
      return renderMergedProps(component, layout, routeProps);
    }} />
  );
};

export default RouteWithLayout;