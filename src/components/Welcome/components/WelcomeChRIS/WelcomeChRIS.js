import React from 'react';
import Button from '../../../Button';

import styles from './WelcomeChRIS.module.css';
import chrisBanner from '../../../../assets/img/chris_logo-ribbon.png';

const WelcomeChRIS = () => (
  <div className={styles['welcome-chris']}>
    <div className={`row`}>
      <div className={styles['welcome-chris-text']}>
        <div className={styles['welcome-chris-text-container']}>
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
            ChRIS uses Docker/containers, Kubernetes/OpenShift, and a set of other
            technologies to standardize healthcare application development.
          </p>
        </div>
      </div>
      <div className={styles['welcome-chris-video-column']}>
        <div>
          <iframe
            title="ChRIS video"
            className={styles['welcome-chris-video']}
            src="https://www.youtube-nocookie.com/embed/dyFQD87jU68"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <p className={styles['welcome-chris-video-desc']}>
            {'"'}Creating ChRIS{'"'} is an upcoming video series by Red Hat films that
            focuses on the ChRIS project - its purpose, development, milestones.
          </p>
        </div>
      </div>
    </div>
    <div className={`row ${styles['welcome-chris-btn-row']}`}>
      <div>
      <Button
          variant="secondary"
          className={`${styles['welcome-chris-btn']} ${styles['welcome-chris-more-btn']}`}
          onClick={()=>{window.open('https://www.chrisproject.org')}}
        >
          Learn more
        </Button>
      </div>
      <div>
        <Button
          variant="secondary"
          className={styles['welcome-chris-btn']}
        >
          Don{"'"}t have access to ChRIS?
        </Button>
      </div>
    </div>
    <span>
      <img src={chrisBanner} alt="" className={styles['welcome-chris-banner']} />
    </span>
  </div>
);

export default WelcomeChRIS;
