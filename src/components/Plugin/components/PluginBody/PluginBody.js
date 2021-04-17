/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import marked from 'marked';
import {
  Grid, Nav, NavItem, TabContainer, TabContent, TabPane,
} from 'patternfly-react';


import './PluginBody.css';
import { CopyURLButton } from '../../../general/CopyURLButton';

const PluginBody = ({ pluginData }) => {
  const [readme, setReadme] = useState();
  const [repoData, setRepoData] = useState();

  const fetchReadme = useCallback(async (repo) => {
    const data = await fetch(`https://api.github.com/repos/${repo}/community/profile`)
    const rm = await fetch((await data.json()).files.readme.url)
    const download = await fetch((await rm.json()).download_url)
    setReadme(await download.text())
  }, [])

  const fetchRepoData = useCallback(async (repo) => {
    const data = await fetch(`https://api.github.com/repos/${repo}`)
    setRepoData(await data.json())
    fetchReadme(repo)
  }, [fetchReadme])

  useEffect(() => {
    const expectRepoName = pluginData.public_repo.split('github.com/')[1];
    if (expectRepoName)
      fetchRepoData(expectRepoName)
    else
      return () => {
        setRepoData(undefined)
      }
  }, [fetchRepoData, pluginData.public_repo])

  return (
    <div className="plugin-body">
      <div className="container-fluid container-cards-pf">
        <div className="row row-cards-pf">
          <Grid>
            <Grid.Row>
              <Grid.Col sm={12}>
                <div className="card-pf">
                  <TabContainer id="basic-tabs" defaultActiveKey={1}>
                    <div>
                      <Nav className="nav nav-tabs nav-tabs-pf plugin-body-nav-tabs">
                        <NavItem eventKey={1}>
                          Overview
                        </NavItem>
                        <NavItem eventKey={2}>
                          Parameters
                        </NavItem>
                        <NavItem eventKey={3}>
                          Versions
                        </NavItem>
                      </Nav>
                      <TabContent animation className="plugin-tab">
                        <TabPane eventKey={1}>
                          <div id="plugin-body-container">
                            <div className="plugin-body-main-col">
                              <div className="plugin-body-readme">
                                README
                              </div>
                              { readme ? <div dangerouslySetInnerHTML={{ __html: marked(readme) }}></div> : null }
                            </div>
                            <div className="plugin-body-side-col">
                              <div className="plugin-body-copy-url">
                                <CopyURLButton className="pf-c-button pf-m-primary" text={pluginData.url} />
                              </div>
                              <div className="plugin-body-detail-section">
                                <h4>Public Repo</h4>
                                <a href={pluginData.public_repo}>
                                  {pluginData.public_repo}
                                </a>
                              </div>
                              <div className="plugin-body-detail-section">
                                <h4>Documentation</h4>
                                <a className="pf-c-button pf-m-link" href="readthedocs.com/freesurfer">
                                  readthedocs.com/freesurfer
                                </a>
                              </div>
                              <div className="plugin-body-detail-section">
                                <h4>Contributors</h4>
                                <a href={pluginData.authorURL}
                                  className="pf-m-link" type="button">
                                  <span className="pf-c-button__icon pf-m-start">
                                    <i className="fas fa-user" aria-hidden="true"></i>
                                  </span>
                                  {pluginData.authors}
                                </a>
                                <div className="plugin-body-contributors-all">
                                  <a className="pf-m-link" href={repoData ? repoData.contributors_url : ''}>
                                    View all contributors...
                                  </a>
                                </div>
                              </div>
                              <div className="plugin-body-detail-section">
                                <h4>Plugin ID</h4>
                                {pluginData.id}
                              </div>
                              <div className="plugin-body-detail-section">
                                <h4>License</h4>
                                { repoData ? repoData.license.name : pluginData.license }
                              </div>
                              <div className="plugin-body-detail-section">
                                <h4>Content Type</h4>
                                {pluginData.type}
                              </div>
                              <div className="plugin-body-detail-section">
                                <h4>Date added</h4>
                                7 July 2020
                              </div>
                            </div>
                          </div>
                        </TabPane>
                        <TabPane eventKey={2}>Parameters content</TabPane>
                        <TabPane eventKey={3}>Versions content</TabPane>
                      </TabContent>
                    </div>
                  </TabContainer>
                </div>
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    </div>
  );
}

PluginBody.propTypes = {
  pluginData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    dock_image: PropTypes.string,
    license: PropTypes.string,
    public_repo: PropTypes.string,
    type: PropTypes.string,
    authorURL: PropTypes.string,
    authors: PropTypes.string,
  }).isRequired,
};

export default PluginBody;
