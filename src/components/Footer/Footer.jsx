import React from 'react';
import styles from './Footer.module.css';
import chrisLogo from '../../assets/img/chris_logo-white.png';

const Footer = () => (
  <div className={styles.footer}>
    <div className={styles.footerRow}>
      <div className={styles.footerLogo}>
        <img src={chrisLogo} alt="ChRIS Plugin Store" />
      </div>
      <div className={styles.footerBody}>
        <div className={styles.footerDesc}>
          ChRIS is developed by Boston Children
          &apos;
          s Hospital in partnership
          with Red Hat, the Massachusetts Open Cloud (MOC), and Boston
          University.
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.footerLink}>
            <a href="https://chrisproject.org">About ChRIS</a>
          </div>
          <div className={styles.footerLink}>
            <a href="/quickstart">Submit your plugin</a>
          </div>
          <div className={styles.footerLink}>
            <a href="mailto:dev@babyMRI.org?subject=Contact from ChRIS Store">
              Contact Us
            </a>
          </div>
          <div className={styles.footerLink}>
            <a href="https://github.com/FNNDSC/ChRIS_store_ui/issues/new">
              Report an Issue
            </a>
          </div>
          <div className={styles.footerLink}>
            <a href="https://github.com/FNNDSC/ChRIS_store_ui">
              Contribute
            </a>
          </div>
          <div className={styles.footerLink}>
            <a href="mailto:dev@babyMRI.org?subject=ChRIS Store Plugin Request">
              Request a plugin
            </a>
          </div>
          {/* <div className={styles.footerLink}>Help</div>
          <div className={styles.footerLink}>Privacy Policy</div>
          <div className={styles.footerLink}>Terms & Conditions</div> */}
        </div>
      </div>
    </div>
    <div className={styles.footerCopyright}>
      © 2018 - {new Date().getFullYear()} Boston Children&apos;s Hospital, Red
      Hat, Massachusetts Open Cloud, Boston University. All rights reserved.
    </div>
  </div>
);

export default Footer;
