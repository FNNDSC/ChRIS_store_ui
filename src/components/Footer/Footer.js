import React from "react";
import styles from "./Footer.module.css";
import chrisLogo from "../../assets/img/chris_logo-white.png";
const Footer = () => (
  <div className="footer">
    <div className="footer-row">
      <div className="footer-logo">
        <img src={chrisLogo} alt="ChRIS Plugin Store" />
      </div>
      <div className={styles['footer-body']}>
        <div className={styles['footer-desc']}>
          ChRIS is developed by Boston Children{"'"}s Hospital in partnership
          with Red Hat, the Massachusetts Open Cloud (MOC), and Boston
          University.
        </div>
        <div className={styles['footer-links']}>
          <div className={styles['footer-link']}>
            <a href="https://chrisproject.org">About ChRIS</a>
          </div>
          <div className={styles['footer-link']}>
            <a href="/quickstart">Submit your plugin</a>
          </div>
          <div className={styles['footer-link']}>
            <a href="mailto:dev@babyMRI.org?subject=Contact from ChRIS Store">
              Contact Us
            </a>
          </div>
          <div className={styles['footer-link']}>
            <a href="https://github.com/FNNDSC/ChRIS_store_ui/issues/new">
              Report an Issue
            </a>
          </div>
           <div className={styles['footer-link']}>
            <a href="https://github.com/FNNDSC/ChRIS_store_ui">
              Contribute
            </a>
          </div>
          <div className={styles['footer-link']}>
            <a href="mailto:dev@babyMRI.org?subject=ChRIS Store Plugin Request">
              Request a plugin
            </a>
          </div>
          {/* <div className="footer-link">Help</div>
          <div className="footer-link">Privacy Policy</div>
          <div className="footer-link">Terms & Conditions</div> */}
        </div>
      </div>
    </div>
    <div className={styles['footer-copyright']}>
      © 2018 - {new Date().getFullYear()} Boston Children{"'"}s Hospital, Red
      Hat, Massachusetts Open Cloud, Boston University. All rights reserved.
    </div>
  </div>
);

export default Footer;
