import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from '../CopyToClipboard/CopyToClipboard';
import styles from './BashLine.module.css';

class BashLine extends Component {
  constructor() {
    super();
    this.tooltipShown = false;
  }

  render() {
    return (
      <div className={styles['bash-line-container']} {...this.props}>
        <div className={styles['bash-line-command']}>
          {`$ ${this.props.command}`}
        </div>
        <CopyToClipboard clipboardText={this.props.command} />
      </div>
    );
  }
}

BashLine.propTypes = { command: PropTypes.string.isRequired };

export default BashLine;
