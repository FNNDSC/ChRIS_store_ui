import React from "react";
import { Grid, GridItem } from '@patternfly/react-core'
import "./WelcomeDevelopers.css";

import Button from '../../../Button'

const WelcomeDevelopers = () => (
  <div id="welcome-developers">
    <div id="welcome-developers-header">
      <span className="tag">DEVELOPERS</span><br/>
      <h1>Developers</h1>
    </div>

    <article style={{ maxWidth: '1000px' }}>
      <Grid>
        <GridItem lg={6} xs={12}>
          {/* <h2 style={{ fontWeight: '600' }}>
            Expand the reach of your image processing software
          </h2> */}
        </GridItem>
        <GridItem lg={6} xs={12}>
          <h2 style={{ fontWeight: '600' }}>
            Expand the reach of your image processing software
          </h2>
          <div className="text-light">
            <p>
              <strong>ChRIS is an open source platform</strong> for medical
              analytics in the cloud, democratizing the development and usage of
              image processing software within an ecosystem following
              <strong> common standards.</strong>
            </p>
          </div>
        </GridItem>
      </Grid>
    </article>

    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <p>
        A developer account enables you to share your analysis
        workflows as containerized software with the <i>ChRIS</i> community of
        researchers and clinicians.
      </p>
      <Button toRoute='/quickstart'>
        Sign Up
      </Button>
    </div>
  </div>
);

export default WelcomeDevelopers;
