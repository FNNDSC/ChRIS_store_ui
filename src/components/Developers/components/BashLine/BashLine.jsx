import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from '../CopyToClipboard/CopyToClipboard';
import './BashLine.css';

class BashLine extends Component {
  constructor() {
    super();
    this.tooltipShown = false;
  }

  render() {
    return (
      <div className="bash-line-container" {...this.props}>
        <div className="bash-line-command">
          {`$ ${this.props.command}`}
        </div>
        <CopyToClipboard clipboardText={this.props.command} />
      </div>
    );
  }
}

BashLine.propTypes = { command: PropTypes.string.isRequired };

export default BashLine;
