/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChrisStore from '../../store/ChrisStore';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const { store } = rest;
      const isLoggedIn = store.get('isLoggedIn');
      if (isLoggedIn) {
        return <Component {...props} />;
      }
      return (
        <Redirect to={{
          pathname: '/signin',
          state: { from: props.location },
        }}
        />
      );
    }}
  />
);

ProtectedRoute.propTypes = {
  store: PropTypes.objectOf(PropTypes.object),
  component: PropTypes.oneOfType([PropTypes.func]).isRequired,
};
ProtectedRoute.defaultProps = {
  store: {},
};

export default ChrisStore.withStore(ProtectedRoute);
