import React from 'react';
import './Footer.css';
import chrisLogo from '../../assets/img/chris_logomark-white.png';

const Footer = () => (
  <div className="footer">
    <div className="footer-row">
      <div className="footer-logo">
        <img src={chrisLogo} alt="" />
        <div className="footer-header">
          <strong>ChRIS </strong>
          Plugin Store
        </div>
      </div>
      <div className="footer-body">
        <div className="footer-desc">
          ChRIS is developed by Boston Children{"'"}s Hospital in partnership with
          Red Hat, the Massachusetts Open Cloud (MOC), and Boston University.
        </div>
        <div className="footer-links">
          <div className="footer-link">About ChRIS</div>
          <div className="footer-link">Submit your plugin</div>
          <div className="footer-link">Contact Us</div>
          <div className="footer-link">Report an Issue</div>
          <div className="footer-link">Request a plugin</div>
          <div className="footer-link">Help</div>
          <div className="footer-link">Privacy Policy</div>
          <div className="footer-link">Terms & Conditions</div>
        </div>
      </div>
    </div>
    <div className="footer-copyright">
      © 2018 Boston Children{"'"}s Hospital, Red Hat, Massachusetts Open Cloud,
      Boston University. All rights reserved.
    </div>
  </div>
);

export default Footer;
