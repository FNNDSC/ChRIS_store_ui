import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import "./BashLine.css";

const BashLine = ({ command, ...props}) => {
  return (
    <div className="bash-line-container" {...props}>
      <div className="bash-line-command">{`$ ${command}`}</div>
      <CopyToClipboard clipboardText={command} />
    </div>
  );
};

BashLine.propTypes = { command: PropTypes.string.isRequired };

export default BashLine;
