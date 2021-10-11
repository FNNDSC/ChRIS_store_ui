import React from "react";
import { Grid, GridItem, TextInput } from '@patternfly/react-core';

import "./WelcomeDevelopers.css";
import Button from '../../../Button';

const WelcomeDevelopers = () => (
  <div id="welcome-developers">
    <div id="welcome-developers-header">
      <span className="tag">DEVELOPERS</span><br/>
      <h1>Expand the Reach <br/> of your Image Processing Software</h1>
      <p>
        ChRIS is an democratizing the development and usage of image processing
        <br/> software with an ecosystem following common standards.
      </p>
    </div>

    {/* <article style={{ maxWidth: '1000px' }}>
      <Grid id="welcome-developers-body">        
        <GridItem lg={12} xs={12} style={{ textAlign: 'center' }}>
          <h2 style={{ fontWeight: '600' }}>
            Open Source Software
          </h2>
          <div className="text-light">
            <p>
              <strong>ChRIS is an open source platform</strong> for medical
              analytics in the cloud, democratizing the development and usage of
              image processing software within an ecosystem following
              <strong> common standards.</strong>
            </p>
          </div>
          <Card>
            <CardBody>
              <h2 style={{ margin: '0.25em 0 1.5em 0' }}><b>Create a ChRIS Developer Account</b></h2>
              <SignUp/>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </article> */}

    <article>
      <Grid hasGutter id="welcome-developers-signup">
        <GridItem lg={8} lgOffset={2} xs={12}>
          <div style={{ fontWeight: 'medium', margin: '1em auto' }}>
            A developer account enables you to share your analysis
            workflows as containerized software with the <b>ChRIS</b> community of
            researchers and clinicians.
          </div>
        </GridItem>

        <GridItem lg={6} lgOffset={3} xs={12}>
        <Grid hasGutter id="call-to-action">
          <GridItem lg={8}>
          <TextInput type="email" aria-label="Email Address" id="email-address" placeholder="Email Address"/>
          </GridItem>
          <GridItem lg={4}>
          <Button variant="primary" toRoute='/quickstart'>
            Sign Up
          </Button>
          </GridItem>
          </Grid>
          <p style={{ fontSize: 'small', margin: '1em auto' }}>
            By siging-up you agree to the terms and privacy policy.
          </p>
        </GridItem>
      </Grid>
    </article>
  </div>
);

export default WelcomeDevelopers;
