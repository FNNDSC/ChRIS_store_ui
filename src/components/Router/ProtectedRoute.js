import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChrisStore from '../../store/ChrisStore';

const isLoggedIn = true;

const ProtectedRoute = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      // const { store } = rest.;
      // const isLoggedInAPI = store.get('isLoggedIn');
      console.log(rest);
      if (isLoggedIn) {
        return <Component {...props} />;
      }
        return <Redirect to="/" />;
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
