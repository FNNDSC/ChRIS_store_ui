import React from 'react';
import { Icon } from 'patternfly-react';
import './WelcomeCTA.css';
import WelcomeFeature from '../WelcomeFeature/WelcomeFeature';

/* plugin images */
import freesurferLogo from '../../../../assets/img/plugins/freesurfer_90.png';

const WelcomeCTA = () => (
  <div className="welcome-cta">
    <div className="welcome-cta-img">
      <div className="row welcome-cta-header">
        Accessible medical imaging using the latest
        research innovations, backed by cloud-based
        computing power.
      </div>
    </div>
    <div className="welcome-cta-featured">
      <div className="welcome-cta-featured-desc">
        Apps available in the ChRIS store include:
      </div>
      <div className="row welcome-cta-featured-container">
        <WelcomeFeature name="pl-z2labelmap" img={freesurferLogo} />
        <WelcomeFeature name="pl-dsdircopy" img={freesurferLogo} />
        <WelcomeFeature name="pl-fetal-brain-mask" img={freesurferLogo} />
        <WelcomeFeature name="pl-flip" img={freesurferLogo} />
        <WelcomeFeature name="pl-freesurfer-pp" img={freesurferLogo} />
      </div>
      <div className="welcome-scroll-caret">
        <Icon name="angle-down" />
      </div>
    </div>
    <div className="row no-flex">
      <div className="welcome-user-cta">
        <div className="welcome-user-cta-header">
          Focus on your data. Not the tools.
        </div>
        <div className="text-light">
          You need to run analyses on data, view the results,
          create visualizations, collaborate on your findings.
          Not build an infrastructure and become a software developer.
        </div>
        <br />
        <div className="text-light">
          The ChRIS platform provides a common infrastructure to
          which you can deploy...
        </div>
      </div>
    </div>
  </div>
);

export default WelcomeCTA;
