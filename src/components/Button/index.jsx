import React from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import './button.css';

const ButtonComponent = ({
  variant,
  onClick,
  loading,
  toRoute,
  children,
  type,
}) => {
  const history = useHistory();
  return (
    <div>
      <Button
        isLoading={loading}
        variant={variant}
        onClick={toRoute ? () => history.push(toRoute) : onClick}
        className="other-button"
        type={type}
      >
        {children}
      </Button>
    </div>
  );
};
ButtonComponent.propTypes = {
  variant: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  toRoute: PropTypes.string
};

export default ButtonComponent;
