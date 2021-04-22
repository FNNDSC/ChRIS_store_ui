/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Nav, NavItem, TabContainer, TabContent, TabPane } from 'patternfly-react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { sanitize } from 'dompurify';

import './PluginBody.css';
import { CopyURLButton } from '../../../general/CopyURLButton';
import Notification from '../../../Notification';
import HttpApiCallError from '../../../../errors/HttpApiCallError';

const PluginBody = ({ pluginData }) => {
  const [repoData, setRepoData] = useState();
  const [readme, setReadme] = useState();
  const setReadmeHTML = $ => setReadme(sanitize($))

  const [errors, setErrors] = useState([]);
  const showNotifications = useCallback((error) => {
    setErrors([ ...errors, error.message ])
  }, [errors])

  const fetchReadme = useCallback(async (repo) => {
    const profile = await (await fetch(`https://api.github.com/repos/${repo}/community/profile`)).json()
    const url = await (await fetch(profile.files.readme.url)).json()

    const file = await (await fetch(url.download_url)).text()
    const type = url.download_url.split('.').reverse().shift()

    return { file, type }
  }, [])

  const fetchRepoData = useCallback(async (repo) => {
    const data = await fetch(`https://api.github.com/repos/${repo}`)
    return await data.json()
  }, [])

  useEffect(() => {
    async function fetchRepo() {
      try {
        const data = await fetchRepoData(expectRepoName)
        setRepoData(data)

        const { file, type } = await fetchReadme(expectRepoName)
        if (type === 'md' || type === 'rst') 
          setReadmeHTML(marked(file))
        else
          setReadmeHTML(file)
      } catch (error) {
        showNotifications(new HttpApiCallError(error))
      }
    }

    const expectRepoName = pluginData.public_repo.split('github.com/')[1];
    if (expectRepoName)
      fetchRepo()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchReadme, fetchRepoData, pluginData.public_repo])

  return (
    <React.Fragment>
      {
        errors.map((message, index) => (
          <Notification
            title={message}
            position='top-right'
            variant='danger'
            closeable
            onClose={() => {
              setErrors(errors.splice(index))
            }}
          />
        ))
      }

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
                                      View all contributors
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
    </React.Fragment>
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
