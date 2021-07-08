import React from 'react';
import PropTypes from 'prop-types';

import './DeveloperCTA.css';

import {
  Card, CardBody, Grid, GridItem,
} from '@patternfly/react-core';
import ConnectedDeveloperSignup from '../DeveloperSignup/DeveloperSignup';
import ChrisStore from '../../../../store/ChrisStore';

export const DeveloperCTA = ({ store }) => (
  <div id="developer-cta">
    <article>
      <Grid hasGutter>
        <GridItem lg={6} xs={12}>
          <div id="developer-cta-header">
            <h1>Expand the reach of your image processing software</h1>
            <p style={{ fontSize: 'medium' }}>
              A ChRIS Developer account enables you to submit your image
              processing application as a containerized ChRIS plugin and
              share it with the broader ChRIS community of researchers and
              clinicians.
            </p>
          </div>
        </GridItem>
        <GridItem lg={1} xs={12} />
        <GridItem lg={5} xs={12}>
          {
          store.get('isLoggedIn') ? null
            : (
              <div id="developer-cta-form">
                <Card>
                  <CardBody>
                    <h2 style={{ margin: '0.25em 0 1.5em 0' }}><b>Create a ChRIS Developer Account</b></h2>
                    <ConnectedDeveloperSignup />
                  </CardBody>
                </Card>
              </div>
            )
        }
        </GridItem>
      </Grid>
    </article>
  </div>
);

export default ChrisStore.withStore(DeveloperCTA);

DeveloperCTA.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};
