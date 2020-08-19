/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { Icon } from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Dropdown, FormGroup, InputGroup, Button, FormControl } from 'react-bootstrap';

class CopyURLButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCopiedText: false
    };
  }
  onCopyText() {
      this.setState({ isCopiedText: true });
  }
  render() {
      return (
        <div className="dropdown">
            <Dropdown id="dropdown-custom-1" rootCloseEvent="click">
                <Dropdown.Toggle bsStyle="primary" bsSize="large">
                    <Icon name="download" className="margin-right-sm" />
                    Install to ChRIS
                </Dropdown.Toggle>
                <Dropdown.Menu className="menu-dropdown">
                    <div className="p-3">
                        <div className="clone-options">
                            <h2><b>Install to your ChRIS server</b></h2>
                            <p>Paste the URL below into your chris-admin dashboard to install
                                this plugin on your ChRIS server:
                            </p>
                            <form>
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Button>
                                            <CopyToClipboard
                                                text='hello'
                                                onCopy={this.onCopyText}>
                                                <Button><Icon name="copy" /></Button>
                                            </CopyToClipboard>
                                        </InputGroup.Button>
                                        <FormControl type="text" disabled value="https://localhost:8010/api/v1" />
                                    </InputGroup>
                                </FormGroup>
                            </form>
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </div>
  );
  }
}

export default CopyURLButton;
