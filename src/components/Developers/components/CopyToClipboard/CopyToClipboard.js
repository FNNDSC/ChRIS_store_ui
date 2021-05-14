import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';
import './CopyToClipboard.css';
import { Tooltip } from '@patternfly/react-core';
import {CopyToClipboard as Clipboard} from 'react-copy-to-clipboard';

class CopyToClipboard extends Component {
  constructor(props) {
    super(props);
    this.overlayTrigger = React.createRef();
    this.showTooltip = this.showTooltip.bind(this);
    this.state = {isClicked:false};
    this.changeClicked = this.changeClicked.bind(this);
  }
  
  changeClicked() {
    this.setState({isClicked:true});
    setTimeout (()=>{
      this.setState({isClicked:false})
    },2000)
  }

  showTooltip() {
    this.overlayTrigger.current.show();
    setTimeout(() => { this.overlayTrigger.current.hide(); }, 600);
  }

  render() {
    return (
      <Tooltip
        content={this.state.isClicked ? <strong>Copied</strong> : <strong>Copy</strong>}>
        <Clipboard
          className="copy-to-clipboard-btn btn btn-large"
          text={this.props.clipboardText}
          onCopy={this.changeClicked}
        >
          <Icon name="copy" />
        </Clipboard>
      </Tooltip>
    );
  }
}

CopyToClipboard.propTypes = { clipboardText: PropTypes.string.isRequired };

export default CopyToClipboard;
