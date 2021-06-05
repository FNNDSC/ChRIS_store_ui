import React, { useState } from "react";
import { DownloadIcon, CopyIcon } from "@patternfly/react-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Dropdown,
  FormGroup,
  InputGroup,
  Button,
  FormControl,
} from "react-bootstrap";

const CopyURLButton = ({text, ...props}) => {
  const [isCopiedText, setIsCopiedText] = useState(false);

  const onCopyText = () => {
    setIsCopiedText(true);
  };

  return (
    <div className="dropdown">
      <Dropdown id="dropdown-custom-1" rootCloseEvent="click">
        <Dropdown.Toggle
          bsStyle="primary"
          bsSize="large"
          className="pf-c-button pf-m-primary"
        >
          <DownloadIcon name="download" className="margin-right-sm" />
          Install to ChRIS
        </Dropdown.Toggle>
        <Dropdown.Menu className="menu-dropdown">
          <div className="p-3">
            <div className="clone-options">
              <h2>
                <b>Install to your ChRIS server</b>
              </h2>
              <p>
                Paste the URL below into your chris-admin dashboard to install
                this plugin on your ChRIS server:
              </p>
              <form>
                <FormGroup>
                  <InputGroup>
                    <FormControl type="text" disabled value={text} />
                    <InputGroup.Button>
                      <CopyToClipboard
                        text={text}
                        onCopy={onCopyText}
                      >
                        <Button>
                          <CopyIcon name="copy" />
                        </Button>
                      </CopyToClipboard>
                    </InputGroup.Button>
                  </InputGroup>
                </FormGroup>
              </form>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default CopyURLButton