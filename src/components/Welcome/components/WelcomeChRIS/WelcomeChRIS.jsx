import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';

import './WelcomeChRIS.css';
import Button from '../../../Button';

const WelcomeChRIS = () => (
  <div id="welcome-chris">
    <div id="welcome-user-cta">
      <div id="welcome-user-cta-header">
        <span className="tag">THE CHRIS PLATFORM</span><br/>
        <h1>
          Focus on your data. Not the tools.
        </h1>
        <p>
          You need to run analyses on data, view the results,
          create visualizations, collaborate on your findings. <br/>
          Not build an infrastructure and become a software developer.
        </p>
      </div>
    </div>

    <article style={{ maxWidth: '800px' }}>
      <Grid>
        <GridItem xs={12}>
          <div style={{ display: 'flex', flexFlow: 'column' }}>
            <iframe
              title="ChRIS video"
              id="welcome-chris-video"
              src="https://www.youtube-nocookie.com/embed/dyFQD87jU68"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <p id="welcome-chris-video-desc">
              <i>Creating ChRIS</i> is an upcoming video series by Red Hat films that
              focuses on the ChRIS project - its purpose, development, milestones.
            </p>
          </div>
        </GridItem>
      </Grid>
    </article>

      {/* <GridItem>
        The ChRIS platform provides a common infrastructure to which you can deploy something.
      </GridItem> */}

    <article style={{ maxWidth: '800px' }}>
      <Grid hasGutter>
        <GridItem sm={12}>
          <div id="welcome-chris-text">
            <div id="welcome-chris-text-container">
              <div>
                What is ChRIS?
              </div>
              <p>
                ChRIS is an open source framework that utilizes cloud technologies to
                democratize medical analytics application development and enables
                healthcare organizations to keep owning their data while benefiting from
                public cloud processing capabilities.
              </p>
              <p>
                ChRIS uses Docker containers, Kubernetes, OpenShift, and a set of other
                technologies to standardize healthcare application development.{' '}
                <a href="https://chrisproject.org">Learn more.</a>
              </p>
            </div>
          </div>
        </GridItem>
      </Grid>
    </article>

    {/* <div id="row welcome-chris-btn-row">
      <div>
      </div>
      <div>
        <Button
          variant="secondary"
          id="welcome-chris-btn"
          onClick={() => window.open('/quickstart')}
        >
          Don{"'"}t have access to ChRIS?
        </Button>
      </div>
    </div> */}
  </div>
);

export default WelcomeChRIS;
