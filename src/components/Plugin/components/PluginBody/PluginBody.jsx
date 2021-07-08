/* eslint-disable react/no-danger */
// Required for setting README html

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  GridItem,
  Tabs,
  Tab,
  TabTitleText,
  Card,
  Popover,
  ClipboardCopy,
  Button,
} from '@patternfly/react-core';
import { DownloadIcon, UserAltIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import marked from 'marked';
import { sanitize } from 'dompurify';

import './PluginBody.css';
import ErrorNotification from '../../../Notification';
import HttpApiCallError from '../../../../errors/HttpApiCallError';
// eslint-disable-next-line import/named
import { GithubAPIRepoError, GithubAPIProfileError, GithubAPIReadmeError } from '../../../../errors/GithubError';

const PluginBody = ({ pluginData }) => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (_, tabIndex) => setActiveTab(tabIndex);

  const [repoData, setRepoData] = useState();
  const [readme, setReadme] = useState();
  const setReadmeHTML = ($) => setReadme(sanitize($));

  const [errors, setErrors] = useState([]);
  const showNotifications = useCallback((error) => {
    setErrors([...errors, error.message]);
  }, [errors]);

  const fetchReadme = useCallback(async (repo) => {
    const profile = await fetch(`https://api.github.com/repos/${repo}/community/profile`);
    if (!profile.ok) throw new GithubAPIProfileError(repo, profile);

    const url = await fetch((await profile.json()).files.readme.url);
    if (!url.ok) throw new GithubAPIReadmeError(repo, url);

    // Has to be done since key is snake_case in data coming from Github
    // eslint-disable-next-line camelcase
    const { download_url } = (await url.json());
    const file = await (await fetch(download_url)).text();
    const type = download_url.split('.').reverse().shift();

    return { file, type };
  }, []);

  const fetchRepoData = useCallback(async (repo) => {
    const data = await fetch(`https://api.github.com/repos/${repo}`);
    if (!data.ok) throw new GithubAPIRepoError(repo, data);

    // Has to be done to avoid reassigning `data`
    // eslint-disable-next-line no-return-await
    return (await data.json());
  }, []);

  useEffect(() => {
    const expectRepoName = pluginData.public_repo.split('github.com/')[1];
    async function fetchRepo() {
      try {
        const data = await fetchRepoData(expectRepoName);
        setRepoData(data);

        const { file, type } = await fetchReadme(expectRepoName);
        if (type === 'md' || type === 'rst') { setReadmeHTML(marked(file)); } else setReadmeHTML(file);
      } catch (error) {
        showNotifications(new HttpApiCallError(error));
      }
    }

    if (expectRepoName) 
      fetchRepo();
  }, [fetchReadme, fetchRepoData, pluginData.public_repo, showNotifications]);

  const versionString = (v) => `Version ${v}${v === pluginData.version ? ' (This)' : ''}`;

  return (
    <>
      {
        errors.map((message, index) => (
          <ErrorNotification
            title={message}
            position="top-right"
            variant="danger"
            closeable
            onClose={() => {
              setErrors(errors.splice(index));
            }}
          />
        ))
      }

      <article>
        <Card id="plugin-body">
          <Tabs activeKey={activeTab} onSelect={handleTabClick}>
            <Tab eventKey={1} title={<TabTitleText>Overview</TabTitleText>}>
              <Grid hasGutter>
                <GridItem md={8} sm={12}>
                  <div style={{ color: 'gray', margin: '1em 0' }}>README</div>
                  { readme ? <div dangerouslySetInnerHTML={{ __html: readme }} /> : null }
                </GridItem>
                <GridItem md={4} sm={12}>
                  <div className="plugin-body-side-col">
                    <div className="plugin-body-detail-section">
                      <h4>Install</h4>
                      <p>Click to install this plugin to your ChRIS Server.</p>
                      <br />
                      <Popover
                        position="bottom"
                        headerContent={<b>Install to your ChRIS server</b>}
                        bodyContent={() => (
                          <div>
                            <p>
                              Copy and Paste the URL below into your ChRIS Admin Dashboard
                              to install this plugin.
                            </p>
                            <br />
                            <ClipboardCopy isReadOnly>
                              {
                                pluginData.url ? pluginData.url
                                  : `${process.env.REACT_APP_STORE_URL}plugins/${pluginData.id}/`
                              }
                            </ClipboardCopy>
                          </div>
                        )}
                      >
                        <Button isBlock style={{ fontSize: '1.125em' }}>
                          <DownloadIcon />
                          {' '}
                          Install to ChRIS
                        </Button>
                      </Popover>
                    </div>
                    <div className="plugin-body-detail-section">
                      <h4>Repository</h4>
                      <a href={pluginData.public_repo}>
                        {pluginData.public_repo}
                      </a>
                    </div>
                    <div className="plugin-body-detail-section">
                      <h4>Contributors</h4>
                      {
                        pluginData.authors.map((author) => (
                          <a key={author} href={`#${author}`}>
                            <p>
                              <UserAltIcon />
                              {' '}
                              {author}
                            </p>
                          </a>
                        ))
                      }

                      <br />
                      <a className="pf-m-link" href={`${pluginData.public_repo}/graphs/contributors`}>
                        View all contributors
                      </a>
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
                </GridItem>
              </Grid>
            </Tab>

            <Tab eventKey={2} title={<TabTitleText>Parameters</TabTitleText>}>
              <Grid hasGutter className="plugin-body-main">
                <GridItem sm={12}>Parameters content</GridItem>
              </Grid>
            </Tab>

            <Tab eventKey={3} title={<TabTitleText>Versions</TabTitleText>}>
              <Grid hasGutter className="plugin-body-main">
                <GridItem sm={12}>
                  {
                    pluginData.versions !== undefined ? (
                      <>
                        <h2>Versions of this plugin</h2>
                        {
                        Object.keys(pluginData.versions).length > 1
                          ? Object.keys(pluginData.versions).map((version) => (
                            <div key={version}>
                              <Link
                                href={`/plugin/${pluginData.name}/${version}`}
                                to={`/plugin/${pluginData.name}/${version}`}
                              >
                                {versionString(version)}
                              </Link>
                            </div>
                          )) : (
                            <div>
                              {versionString(Object.keys(pluginData.versions).toString())}
                            </div>
                          )
                      }
                      </>
                    ) : (
                      <div>
                        <p>This is the only version of this plugin.</p>
                      </div>
                    )
                  }
                </GridItem>
              </Grid>
            </Tab>
          </Tabs>
        </Card>
      </article>
    </>
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
    authors: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default PluginBody;
