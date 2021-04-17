import React from 'react';
import { AngleDownIcon } from '@patternfly/react-icons';
import './WelcomeCTA.css';
import WelcomeFeature from '../WelcomeFeature/WelcomeFeature';

/* plugin images */
import freesurferLogo from '../../../../assets/img/plugins/freesurfer_90.png';
import tensorflowLogo from '../../../../assets/img/plugins/tensorflow_90.png';
import fslLogo from '../../../../assets/img/plugins/fsl_90.png';
import rhoanaLogo from '../../../../assets/img/plugins/rhoana_90.png';
import slicerLogo from '../../../../assets/img/plugins/slicer_90.png';

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
        <WelcomeFeature name="FreeSurfer" img={freesurferLogo} />
        <WelcomeFeature name="TensorFlow" img={tensorflowLogo} />
        <WelcomeFeature name="FMRIB Software Library" img={fslLogo} />
        <WelcomeFeature name="RhoANA" img={rhoanaLogo} />
        <WelcomeFeature name="Slicer" img={slicerLogo} />
      </div>
      <div className="welcome-scroll-caret">
        <AngleDownIcon/>
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
