import React from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'react-clipboard.js';
import { Tooltip } from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';
import './CopyToClipboard.css';

const CopyToClipboard = ({ clipboardText }) => (
  <div>
    <Tooltip id="copiedTooltip"
      trigger="click"
      content={(
        <strong>Copied!</strong>
      )}>
      <Clipboard
        className="copy-to-clipboard-btn btn btn-large"
        data-clipboard-text={clipboardText}
      >
        <CopyIcon />
      </Clipboard>
    </Tooltip>
  </div>
)

CopyToClipboard.propTypes = { clipboardText: PropTypes.string.isRequired };

export default CopyToClipboard;
