import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  ListView,
  Col,
} from 'patternfly-react';
import {Card, CardTitle, CardBody} from '@patternfly/react-core';
import './DashGitHubView.css';
import BrainyPointer from '../../../../assets/img/brainy-pointer.png';

const DashGitHubEmptyState = () => (
  <div>
    <span className="pficon pficon-info" id="no-plugin-info-icon" />
    <span className="github-plugin-noplugin-title">Revisions Panel</span>
    <p className="github-plugin-noplugin-text">The most recent 10 changes to your plugins will appear here.</p>
    <div>
      <img src={BrainyPointer} alt="Click Add Plugin" />
    </div>
  </div>);

class DashGitHubView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { plugins } = this.props;
    const showEmptyState = isEmpty(plugins);

    return (
      <Col sm={12}>
        <Card>
            <CardTitle>
              Revisions to My Plugins
            </CardTitle>
          <CardBody className="github-card-body">
            { showEmptyState ?
              <DashGitHubEmptyState />
              :
              <ListView className="github-description" />
            }
          </CardBody>
        </Card>
      </Col>
    );
  }
}
DashGitHubView.propTypes = {
  plugins: PropTypes.arrayOf(PropTypes.object),
};

DashGitHubView.defaultProps = {
  plugins: [],
};

export default DashGitHubView;
