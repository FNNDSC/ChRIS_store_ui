import React from 'react';
import { Card, CardBody } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import styles from './DeveloperCTA.module.css';
import ConnectedDeveloperSignup from '../DeveloperSignup/DeveloperSignup';
import ChrisStore from '../../../../store/ChrisStore';

export const DeveloperCTA = ({ store }) => (
  <div className={styles['developer-cta']}>
    <div className={`row ${styles['developer-cta-container']}`}>
      <div className={styles['developer-cta-overview']}>
        <div className={styles['developer-cta-header']}>
          Expand the reach of your image processing software
        </div>
        <div className={styles['developer-cta-desc']}>
          <p>
          ChRIS is an <strong>open source platform</strong> for medical
          analytics in the cloud, democratizing the development of image
          processing apps within an ecosystem following
            <strong>
              {' '}common standards, rather than disparate silos
            </strong>.
          </p>

          <p>
          A ChRIS Developer account enables you to submit your image
          processing application as a containerized ChRIS plugin and
          share it with the broader ChRIS community of researchers and
          clinicians. <strong>Join us!</strong>
          </p>
        </div>
      </div>
      {
        store.get('isLoggedIn') ?
          null
          :
          <div className={styles['developer-cta-form']}>
            <Card>
              <CardBody>
                <ConnectedDeveloperSignup />
              </CardBody>
            </Card>
          </div>
      }
    </div>
  </div>
);

export default ChrisStore.withStore(DeveloperCTA);

DeveloperCTA.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};
