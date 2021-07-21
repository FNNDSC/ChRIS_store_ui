import React from 'react';
import { Button, clipboardCopyFunc, Tooltip } from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import './BashLine.css';

function BashLine({ command }) {
  return (
    <div className="bash-line-container">
      <div className="bash-line-command">
        {`$ ${command}`}
      </div>
      <Tooltip content="Copy">
        <Button
          isSmall
          variant="control"
          aria-label="Copy"
          onClick={(e) => clipboardCopyFunc(e, command)}
        >
          <CopyIcon />
        </Button>
      </Tooltip>
    </div>
  );
}

BashLine.propTypes = { command: PropTypes.string.isRequired };

export default BashLine;
