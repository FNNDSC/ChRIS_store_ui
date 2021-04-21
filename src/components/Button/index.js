import React from "react";
import { Button } from "@patternfly/react-core";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import styles from  "./button.module.css";
const ButtonComponent = ({
  variant,
  onClick,
  loading,
  toRoute,
  children,
  type,
  ...otherProps
}) => {
  const history = useHistory();
  return (
    <div  {...otherProps}>
      <Button
        isLoading={loading}
        variant={variant}
        onClick={toRoute ? () => history.push(toRoute) : onClick}
        className={styles['other-button']}
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
  icon: PropTypes.object,
  loading: PropTypes.bool,
  };

export default ButtonComponent;
