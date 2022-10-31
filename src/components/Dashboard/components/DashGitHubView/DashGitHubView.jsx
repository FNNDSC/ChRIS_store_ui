import React, { useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { List, Card, CardTitle, CardBody } from '@patternfly/react-core';

import './DashGitHubView.css';
import BrainyPointer from '../../../../assets/img/brainy-pointer.png';

const DashGitHubEmptyState = () => (
  <div>
    <p>The most recent 10 changes to your plugins will appear here.</p>
    <img src={BrainyPointer} alt="Click to Add Plugin" />
  </div>
);

const DashGitHubView = (props) => {
  const [state, setState] = useState('');

  const { plugins } = props;
  const showEmptyState = isEmpty(plugins);

  return (
    <Card>
      <CardTitle>Revisions</CardTitle>
      <CardBody className="github-card-body">
        {showEmptyState ? <DashGitHubEmptyState /> : <List className="github-description" />}
      </CardBody>
    </Card>
  );
};

DashGitHubView.propTypes = {
  plugins: PropTypes.arrayOf(PropTypes.object),
};

DashGitHubView.defaultProps = {
  plugins: [],
};

export default DashGitHubView;
