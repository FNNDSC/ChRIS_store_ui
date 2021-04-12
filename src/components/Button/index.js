import React from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
const ButtonComponent = (props) => {
  const {
    variant,
    onClick,
    customClass,
    icon,
    loading,
  } = props;
  return(
    <div className="chris-button">
      <Button
        isLoading={loading}
        spinnerAriaValueText
        variant={variant}
        onClick={onClick}
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