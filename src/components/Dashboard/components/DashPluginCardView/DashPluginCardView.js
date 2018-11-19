import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash-es';
import {
  UtilizationCard,
  UtilizationCardDetails,
  UtilizationCardDetailsCount,
  UtilizationCardDetailsDesc,
  UtilizationCardDetailsLine1,
  UtilizationCardDetailsLine2,
  DonutChart,
  SparklineChart,
  Col,
  CardTitle,
  CardBody,
  EmptyState,
  EmptyStateAction,
  EmptyStateInfo,
  EmptyStateTitle,
  Button,
  Card,
} from 'patternfly-react';

import './DashPluginCardView.css';
import BrainImg from '../../../../assets/img/empty-brain-xs.png';
import PluginPointer from '../../../../assets/img/brainy_welcome-pointer.png';

const DashGitHubEmptyState = () => (
  <Col xs={12}>
    <Card>
      <CardTitle>
        My Plugins
      </CardTitle>
      <CardBody className="card-body-empty">
        <h1 className="card-body-header-text">You have no plugins in the ChRIS store</h1>
        <h2 className="card-body-subhead">Lets fix that!</h2>
        <div className="card-body-content-parent">
          <div>
            <img src={PluginPointer} alt="Click Add Plugin" />
          </div>
          <div className="card-body-content-child-right">
            <p>
              Create a new listing for your plugin in the ChRIS
              store by clicking &#34;Add Plugin&#34; below.
            </p>
            <Button bsStyle="primary" bsSize="large" href="/create">
              Add Plugin
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>);

const DashPluginCardView = (props) => {
  const { plugins } = props;
  const showEmptyState = _.isEmpty(plugins);
  return (
    showEmptyState ?
      <DashGitHubEmptyState />
      :
      <React.Fragment>
        <div className="dashboard-row">
          <Col xs={12} sm={6} md={4}>
            <UtilizationCard>
              <CardTitle>
                Free Surfer
              </CardTitle>
              <CardBody>
                <strong>Created on </strong>10/5/2018
                <UtilizationCardDetails>
                  <UtilizationCardDetailsCount>
                    900
                  </UtilizationCardDetailsCount>
                  <UtilizationCardDetailsDesc>
                    <UtilizationCardDetailsLine1>
                      Downloads
                    </UtilizationCardDetailsLine1>
                    <UtilizationCardDetailsLine2>
                      of 1100 Total
                    </UtilizationCardDetailsLine2>
                  </UtilizationCardDetailsDesc>
                </UtilizationCardDetails>
                <DonutChart
                  id="donut-chart-1"
                  data={{
                    columns: [['Free Surfer', 900], ['Others', 200]],
                    colors: {
                      'Free Surfer': '#00659c',
                      Others: '#393f44',
                    },
                  }}
                  title={{
                    type: 'total',
                    secondary: 'Downloads',
                  }}
                  tooltip="test tooltip"
                  legend={{
                    show: true,
                    position: 'right',
                  }}
                />
                <SparklineChart
                  id="line-chart-1"
                  data={{
                    columns: [[
                      'Page Visits',
                      30,
                      200,
                      99,
                      220]],
                    type: 'area',
                  }}
                />
              </CardBody>
            </UtilizationCard>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <UtilizationCard>
              <CardBody>
                <EmptyState>
                  <div>
                    <img width="77" height="61" src={BrainImg} alt="Add new plugin" />
                  </div>
                  <EmptyStateTitle>
                    Add a Plugin
                  </EmptyStateTitle>
                  <EmptyStateInfo>
                    Click below to add a new ChRIS plugin
                  </EmptyStateInfo>
                  <EmptyStateAction>
                    <Button bsStyle="primary" bsSize="large" href="/create">
                      Add Plugin
                    </Button>
                  </EmptyStateAction>
                </EmptyState>
              </CardBody>
            </UtilizationCard>
          </Col>
        </div>
      </React.Fragment>
  );
};

DashPluginCardView.propTypes = {
  plugins: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DashPluginCardView;
