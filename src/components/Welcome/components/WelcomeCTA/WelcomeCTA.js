import React from 'react';
import { AngleDownIcon } from '@patternfly/react-icons';
import './WelcomeCTA.css';
import WelcomeFeature from '../WelcomeFeature/WelcomeFeature';

/* plugin images */
import infantLogo from '../../../../assets/img/plugins/infant_90.png';
import freesurferLogo from '../../../../assets/img/plugins/freesurfer_90.png';
import biomediaLogo from '../../../../assets/img/plugins/biomedia_90.png';
import antLogo from '../../../../assets/img/plugins/ant_90.png';
import civetLogo from '../../../../assets/img/plugins/civet_90.png';

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
        <WelcomeFeature name="Fastsurfer" img={freesurferLogo} url='https://chrisstore.co/plugin/44'/>
        <WelcomeFeature name="Infant-FreeSurfer" img={infantLogo} url='https://chrisstore.co/plugin/78'/>
        <WelcomeFeature name="IRTK reconstruction" img={biomediaLogo} url='https://chrisstore.co/plugin/85'/>
        <WelcomeFeature name="N4 Bias Field Correction" img={antLogo} url='https://chrisstore.co/plugin/77'/>
        <WelcomeFeature name="Civet" img={civetLogo} url='https://chrisstore.co/plugin/2'/>
      </div>
      <div className='welcome-scroll-caret'>
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
