/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import rst2html from 'rst2html';
import {
  Grid, Nav, NavItem, TabContainer, TabContent, TabPane,
} from 'patternfly-react';

import './PluginBody.css';
import { CopyURLButton } from '../../../general/CopyURLButton';

const PluginBody = ({ pluginData }) => {
  const [readme, setReadme] = useState();
  const [repoData, setRepoData] = useState();

  const getReadmeFileType = (url) => (
    url
      .split('').reverse().join('')   // Reverse the URL
      .split('.').shift()             // Get first segment before '.'
      .split('').reverse().join('')   // Reverse again to get original
  )

  const fetchReadme = useCallback(async (repo) => {
    const rurl = await fetch((
      await (
        await fetch(`https://api.github.com/repos/${repo}/community/profile`)
      ).json()).files.readme.url)

    const downloadUrl = (await rurl.json()).download_url
    const readmeType = getReadmeFileType(downloadUrl)
    const file = await fetch(downloadUrl)

    if (readmeType === 'md' || readmeType === 'rst') // temporary until we find a way to render rst
      setReadme(marked(await file.text()))
    // else if (readmeType === 'rst')
    //   setReadme(rst2html(await file.text()))
    else if (readmeType === 'html' || readmeType === 'htm')
      setReadme(await file.text())
    else 
      throw TypeError('Unknown README file type:', readmeType)
  }, [])

  const fetchRepoData = useCallback(async (repo) => {
    try {
      const data = await fetch(`https://api.github.com/repos/${repo}`)
      setRepoData(await data.json())
      fetchReadme(repo)
    } catch (error) {
      console.error(error)
      throw Error(error)
    }
  }, [fetchReadme])

  useEffect(() => {
    const expectRepoName = pluginData.public_repo.split('github.com/')[1];
    if (expectRepoName)
      try {
        fetchRepoData(expectRepoName)
      } catch (error) {
        console.error(error)
      }
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
                              { readme ? <div dangerouslySetInnerHTML={{ __html: readme }}></div> : null }
                            </div>
                            <div className="plugin-body-side-col">
                              <div className="plugin-body-copy-url">
                                <CopyURLButton className="pf-c-button pf-m-primary" text={pluginData.url} />
                              </div>
                              <div className="plugin-body-detail-section">
                                <h4>Repository</h4>
                                <a href={pluginData.public_repo}>
                                  {pluginData.public_repo}
                                </a>
                              </div>
                              {/* <div className="plugin-body-detail-section">
                                <h4>Documentation</h4>
                                <a className="pf-c-button pf-m-link" href="readthedocs.com/freesurfer">
                                  readthedocs.com/freesurfer
                                </a>
                              </div> */}
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
                                  <br/>
                                  <a className="pf-m-link" href={`${pluginData.public_repo}/graphs/contributors`}>
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
                                {(new Date(pluginData.creation_date)).toDateString()}
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
