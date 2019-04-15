import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isLoggedIn = true;

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        // console.log(this.props);
        if (isLoggedIn) {
          return <Component {...props} />;
        }
          return <Redirect to="/Developers" />;
      }}
  />
);

export default ProtectedRoute;
