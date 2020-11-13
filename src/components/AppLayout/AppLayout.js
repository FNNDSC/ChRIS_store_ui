// based on
// https://github.com/patternfly/patternfly-react-seed/blob/2195cdb69c4a82b64b4cf6870a67750cc1896ef2/src/app/AppLayout/AppLayout.tsx

import React from 'react';
import { Page, SkipToContent } from '@patternfly/react-core';
import ConnectedNavbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const PageSkipToContent = (
  <SkipToContent href="#primary-app-container">
    Skip to Content
  </SkipToContent>
);

const AppLayout = ({ children }) => (
  <Page
    header={<ConnectedNavbar />}
    mainContainerId="primary-app-container"
    skipToContent={PageSkipToContent}
    >
    {children}
    <Footer />
  </Page>
);

export default AppLayout;
