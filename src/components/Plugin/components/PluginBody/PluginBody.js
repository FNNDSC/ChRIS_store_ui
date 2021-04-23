/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Grid } from "patternfly-react";
import "./PluginBody.css";
import { CopyURLButton } from "../../../general/CopyURLButton";
import { Tabs, Tab, TabTitleText } from "@patternfly/react-core";

const PluginBody = ({ pluginData }) => {
  const [activeTabKey, setActiveTabKey] = useState(1);
  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <div className="plugin-body">
      <div className="container-fluid container-cards-pf">
        <div className="row row-cards-pf">
          <Grid>
            <Grid.Row>
              <Grid.Col sm={12}>
                <div className="card-pf">
                  <Tabs
                    activeKey={activeTabKey}
                    onSelect={handleTabClick}
                  >
                    <Tab
                      eventKey={1}
                      title={<TabTitleText>Overview</TabTitleText>}
                      className="plugin-tab"
                    >
                      <div className="plugin-body-main-col">
                        <div className="plugin-body-readme">README.rst</div>
                        <h1 className="pf-c-title pf-m-4xl plugin-body-title">
                          {pluginData.title}
                        </h1>
                        <div className="plugin-body-toc">
                          <h3 className="pf-c-title pf-m-2xl">
                            Table of Contents
                          </h3>
                          <ul className="pf-c-list">
                            <li>
                              <Link
                                href={pluginData.title}
                                to={pluginData.title}
                              >
                                Abstract
                              </Link>
                            </li>
                            <li>
                              <Link
                                href={pluginData.title}
                                to={pluginData.title}
                              >
                                Synopsis
                              </Link>
                            </li>
                            <li>
                              <Link
                                href={pluginData.title}
                                to={pluginData.title}
                              >
                                Run
                              </Link>
                              <ul>
                                <li>
                                  <Link
                                    href={pluginData.title}
                                    to={pluginData.title}
                                  >
                                    Using PyPi
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={pluginData.title}
                                    to={pluginData.title}
                                  >
                                    Using
                                    <code>docker run</code>
                                  </Link>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <Link
                                href={pluginData.title}
                                to={pluginData.title}
                              >
                                Examples
                              </Link>
                              <ul className="pf-c-list">
                                <li>
                                  <Link
                                    href={pluginData.title}
                                    to={pluginData.title}
                                  >
                                    Check available pre-processed runs
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={pluginData.title}
                                    to={pluginData.title}
                                  >
                                    Copy the default for a selected
                                    pre-processed run
                                  </Link>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                        <div className="plugin-body-content">
                          <h2 className="pf-c-title pf-m-3xl">Abstract</h2>
                          <hr />
                          <p>
                            {/* eslint-disable-next-line */}
                            <code>freesurfer_pp_moc.py</code> is a dummy
                            FreeSurver plugin/container that is prepopulated
                            with the results of several priori FreeSurfer runs.
                            For a given run, this script will simply copy
                            elements of one of these prior runs to the output
                            directory.
                          </p>
                          <h2 className="pf-c-title pf-m-3xl">Synopsis</h2>
                          <hr />
                          <p>
                            <code>
                              python freesurfer_pp.py
                              {/* eslint-disable-next-line */}
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et dolore magna aliqua. Ut enim ad minim veniam,
                              quis nostrud exercitation ullamco laboris nisi ut
                              aliquip ex ea commodo consequat. Duis aute irure
                              dolor in reprehenderit in voluptate velit esse
                              cillum dolore eu fugiat nulla pariatur. Excepteur
                              sint occaecat cupidatat non proident, sunt in
                              culpa qui officia deserunt mollit anim id est
                              laborum.
                            </code>
                          </p>
                        </div>
                      </div>
                      <div className="plugin-body-side-col">
                        <div className="plugin-body-copy-url">
                          <CopyURLButton
                            className="pf-c-button pf-m-primary"
                            text={pluginData.url}
                          />
                        </div>
                        <div className="plugin-body-public-repo">
                          <h4>Public Repo:</h4>
                          <Link
                            href={pluginData.public_repo}
                            to={pluginData.public_repo}
                            className="pf-c-button pf-m-link"
                          >
                            {pluginData.public_repo}
                          </Link>
                        </div>
                        <div className="plugin-body-documentation">
                          <h4>Documentation:</h4>
                          {/* eslint-disable-next-line */}
                          <a className="pf-c-button pf-m-link">
                            readthedocs.com/freesurfer
                          </a>
                        </div>
                        <div className="plugin-body-contributors">
                          <h4>Contributors (20):</h4>
                          <a
                            href={pluginData.authorURL}
                            className="pf-c-button pf-m-link"
                            type="button"
                          >
                            <span className="pf-c-button__icon pf-m-start">
                              <i className="fas fa-user" aria-hidden="true"></i>
                            </span>
                            {pluginData.authors}
                          </a>
                          {/* <Icon name="user" size="lg" />
                            <Link
                              href={pluginData.authorURL}
                              to={pluginData.authors}
                              className="pf-c-button pf-m-link"
                            >
                              {pluginData.authors}
                            </Link> */}
                          <div className="plugin-body-contributors-all">
                            {/* eslint-disable-next-line */}
                            <a className="pf-c-button pf-m-link">
                              View all contributors...
                            </a>
                          </div>
                        </div>
                        <div className="plugin-body-license">
                          <h4>License:</h4>
                          {pluginData.license}
                        </div>
                        <div className="plugin-body-content-type">
                          <h4>Content Type:</h4>
                          {pluginData.type}
                        </div>
                        <div className="plugin-body-date-added">
                          <h4>Date added:</h4>7 July 2020
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      eventKey={2}
                      title={<TabTitleText>Parameters</TabTitleText>}
                      className="plugin-tab"
                    >
                      Parameters
                    </Tab>
                    <Tab
                      eventKey={3}
                      title={<TabTitleText>Versions</TabTitleText>}
                      className="plugin-tab"
                    >
                      Versions
                    </Tab>
                  </Tabs>
                </div>
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    </div>
  );
};

PluginBody.propTypes = {
  pluginData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    dock_image: PropTypes.string,
    license: PropTypes.string,
    public_repo: PropTypes.string,
    type: PropTypes.string,
    authorURL: PropTypes.string,
    authors: PropTypes.string
  }).isRequired
};

export default PluginBody;
