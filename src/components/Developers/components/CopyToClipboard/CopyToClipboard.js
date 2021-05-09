import React from "react";
import PropTypes from "prop-types";
import Clipboard from "react-clipboard.js";
import { Tooltip } from "@patternfly/react-core";
import { CopyIcon } from "@patternfly/react-icons";
import styles from './CopyToClipboard.module.css';

const CopyToClipboard = (props) => {

  return (
    
    <Tooltip
      trigger="click"
      className={styles['copiedTooltip']}
      position="bottom"
      content={<strong>Copied!</strong>}
    >
      <Clipboard
        className={`${styles['copy-to-clipboard-btn']} btn btn-large`}
        data-clipboard-text={props.clipboardText}
      >
        <CopyIcon name="copy" />
      </Clipboard>
    </Tooltip>
  );
};
CopyToClipboard.propTypes = { clipboardText: PropTypes.string.isRequired };

export default CopyToClipboard;
