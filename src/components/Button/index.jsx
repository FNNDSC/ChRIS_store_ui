import React from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import './button.css';

const ButtonComponent = ({ variant, onClick, loading, toRoute, children, type, isDisabled }) => {
  const history = useHistory();

  return (
    <div>
      <Button
        isLoading={loading}
        isDisabled={isDisabled}
        variant={variant}
        onClick={
          toRoute
            ? () => {
                history.push(toRoute);
                window.scrollTo(0, 0);
              }
            : onClick
        }
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
  toRoute: PropTypes.string,
};

export default ButtonComponent;
