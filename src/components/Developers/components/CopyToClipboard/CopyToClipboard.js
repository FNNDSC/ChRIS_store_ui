import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'react-clipboard.js';
import { Icon, OverlayTrigger, Tooltip } from 'patternfly-react';
import styles from './CopyToClipboard.module.css';

class CopyToClipboard extends Component {
  constructor(props) {
    super(props);
    this.overlayTrigger = React.createRef();
    this.showTooltip = this.showTooltip.bind(this);
  }

  showTooltip() {
    this.overlayTrigger.current.show();
    setTimeout(() => { this.overlayTrigger.current.hide(); }, 600);
  }

  render() {
    return (
      <OverlayTrigger
        placement="bottom"
        ref={this.overlayTrigger}
        onClick={this.showTooltip}
        overlay={(
          <Tooltip
            id={styles['copiedTooltip']}
          >
            <strong>Copied!</strong>
          </Tooltip>
        )}
      >
        <Clipboard
          className={`${styles['copy-to-clipboard-btn']} btn btn-large`}
          data-clipboard-text={this.props.clipboardText}
        >
          <Icon name="copy" />
        </Clipboard>
      </OverlayTrigger>
    );
  }
}

CopyToClipboard.propTypes = { clipboardText: PropTypes.string.isRequired };

export default CopyToClipboard;
