import React from "react";
import "./WelcomeDevelopers.css";
import { Link } from "react-router-dom";

const WelcomeDevelopers = () => (
  <React.Fragment>
    <div className="welcome-developers column">
      <div className="welcome-developers-header">
        Expand the reach of your image processing software
      </div>
      <div className="text-light">
        <p>
          ChRIS is an <strong>open source platform</strong> for medical
          analytics in the cloud, democratizing the development of image
          processing apps within an ecosystem following
          <strong> common standards, rather than disparate silos</strong>.
        </p>
        <p>
          A ChRIS Developer account enables you to submit your image processing
          application as a containerized ChRIS plugin and share it with the
          broader ChRIS community of researchers and clinicians.{" "}
          <strong>Join us!</strong>
        </p>
      </div>
      <Link to="/quickstart" className="btn callToAction-btn btn-primary">
        Learn More
      </Link>
    </div>
  </React.Fragment>
);

export default WelcomeDevelopers;
