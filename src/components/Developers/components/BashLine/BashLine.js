import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import styles from './BashLine.module.css';

const BashLine = ({ command, ...props}) => {
  return (
    <div className={styles['bash-line-container']} {...props}>
      <div className={styles['bash-line-command']}>{`$ ${command}`}</div>
      <CopyToClipboard clipboardText={command} />
    </div>
  );
};

BashLine.propTypes = { command: PropTypes.string.isRequired };

export default BashLine;
