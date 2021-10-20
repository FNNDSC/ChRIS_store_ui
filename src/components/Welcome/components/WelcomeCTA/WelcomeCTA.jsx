import React from 'react';
import './WelcomeCTA.css';
import WelcomeFeature from '../WelcomeFeature/WelcomeFeature';

/* plugin images */
import infantLogo from '../../../../assets/img/plugins/infant_90.png';
import freesurferLogo from '../../../../assets/img/plugins/freesurfer_90.png';
import biomediaLogo from '../../../../assets/img/plugins/biomedia_90.png';
import antLogo from '../../../../assets/img/plugins/ant_90.png';
import civetLogo from '../../../../assets/img/plugins/civet_90.png';

const WelcomeCTA = () => {
  // Object to make fetching from build/external easier later
  const features = [
    { name: 'Fastsurfer', url: 'https://chrisstore.co/plugin/44', img: freesurferLogo },
    { name: 'Civet', url: 'https://chrisstore.co/plugin/2', img: civetLogo },
    { name: 'Infant FreeSurfer', url: 'https://chrisstore.co/plugin/78', img: infantLogo },
    { name: 'IRTK Reconstruction', url: 'https://chrisstore.co/plugin/85', img: biomediaLogo },
    { name: 'N4 Bias Field Correction', url: 'https://chrisstore.co/plugin/77', img: antLogo },
  ];

  return (
    <>
      <div className="welcome-cta">
        <article>
          <div id="welcome-cta-header">
            <h1>ChRIS Store</h1>
            <p>
              Accessible medical imaging using the latest research innovations, backed by
              cloud-based computing power.
            </p>
          </div>
        </article>

        <article>
          <div className="welcome-cta-featured">
            {/* <div style={{ opacity: 0.75, color: 'white', textAlign: 'center' }}>
            <h2>Apps available in the ChRIS Store</h2>
          </div> */}
            <div className="row welcome-cta-featured-container">
              {features.map((feature) => (
                <WelcomeFeature key={feature.name} {...feature} />
              ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default WelcomeCTA;
