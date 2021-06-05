import React, { useState } from "react";
import { Button, Popover } from "@patternfly/react-core";
import { DownloadIcon, CopyIcon } from "@patternfly/react-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyURLButton = ({text, ...props}) => {
  const [_, setIsCopiedText] = useState(false);
  const onCopyText = () => {
    setIsCopiedText(true);
  };

  return (
    <Popover
      position="bottom"
      headerContent={<b>Install to your ChRIS server</b>}
      bodyContent={hide => (
        <div>
          <p>
            Copy and Paste the URL below into your ChRIS Admin Dashboard 
            to install this plugin.
          </p>
          <br />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <input
              className="pf-c-form-control"
              readOnly
              type="text"
              value={text}
              style={{ flexGrow: '1' }}
            />
            <CopyToClipboard text={text} onCopy={onCopyText}>
              <Button variant="tertiary">
                <CopyIcon name="copy" />
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      )}
    >
      <Button isBlock style={{ fontSize: '1.125em' }}>
        <DownloadIcon /> Install to ChRIS
      </Button>
    </Popover>
  );
};

export default CopyURLButton