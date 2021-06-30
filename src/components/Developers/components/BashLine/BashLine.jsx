import React from 'react';
import { Button, clipboardCopyFunc, Tooltip } from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import './BashLine.css';

function BashLine(props) {
  return (
    <div className="bash-line-container" {...props}>
      <div className="bash-line-command">
        {`$ ${props.command}`}
      </div>
      <Tooltip content="Copy">
        <Button isSmall 
          variant="control" 
          aria-label="Copy" 
          onClick={(e) => clipboardCopyFunc(e, props.command)}
        >
          <CopyIcon />
        </Button>
      </Tooltip>
    </div>
  );
}

BashLine.propTypes = { command: PropTypes.string.isRequired };

export default BashLine;
