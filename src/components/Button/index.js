import React from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
const ButtonComponent = (props) => {
  const {
    variant,
    onClick,
    customClass,
    loading,
    toRoute,
  } = props;
  const history = useHistory();
  return(
    <div className="chris-button">
      <Button
        isLoading={loading}
        spinnerAriaValueText
        variant={variant}
        onClick={toRoute?history.push(toRoute):onClick}
        className={customClass}
        {...props}
      >
        {props.children}
        </Button>
    </div>
  );
};
ButtonComponent.propTypes = {
  variant: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.object,
  loading: PropTypes.bool,
  customClass: PropTypes.string
};

export default ButtonComponent;