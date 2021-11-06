import React from 'react';
import { Button, clipboardCopyFunc, Tooltip } from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import styles from './BashLine.module.css';

function BashLine({ command }) {
  return (
    <div className={styles.bashLineContainer}>
      <div className={styles.bashLineCommand}>
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
