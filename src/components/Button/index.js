import React from "react";
import { Button } from "@patternfly/react-core";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import "./button.css";
const ButtonComponent = ({
  variant,
  onClick,
  customClass,
  loading,
  toRoute,
  children,
  ...otherProps
}) => {
  const history = useHistory();
  return (
    <div className="chris-button">
      <Button
        isLoading={loading}
        spinnerAriaValueText
        variant={variant}
        onClick={toRoute ? history.push(toRoute) : onClick}
        className={customClass}
        {...otherProps}
      >
        {children}
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
